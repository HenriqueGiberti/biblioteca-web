package com.biblioteca;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Teste de integracao: Controller + Repository + banco H2 (perfil "test"). */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class IntegracaoTest {

    @Autowired
    private MockMvc mockMvc;

    private long criarAutor(String nome) throws Exception {
        String corpo = mockMvc.perform(post("/api/autores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"" + nome + "\",\"nacionalidade\":\"Brasileira\","
                                + "\"dataNascimento\":\"1839-06-21\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Number id = JsonPath.read(corpo, "$.id");
        return id.longValue();
    }

    @Test
    void deveVincularLivroAAutor() throws Exception {
        long autorId = criarAutor("Machado de Assis");

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"Dom Casmurro\",\"isbn\":\"978-8535910667\","
                                + "\"anoPublicacao\":1899,\"genero\":\"Romance\","
                                + "\"autor\":{\"id\":" + autorId + "}}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.autor.id").value(autorId))
                .andExpect(jsonPath("$.autor.nome").value("Machado de Assis"));

        // (extra) endpoint de livros por autor
        mockMvc.perform(get("/api/livros/autor/" + autorId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Dom Casmurro"));
    }

    // (extra) fluxo completo: criar -> buscar -> atualizar -> deletar
    @Test
    void deveExecutarFluxoCompletoAutor() throws Exception {
        long id = criarAutor("Clarice Lispector");

        mockMvc.perform(get("/api/autores/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Clarice Lispector"));

        mockMvc.perform(put("/api/autores/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Clarice L.\",\"nacionalidade\":\"Brasileira\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Clarice L."));

        mockMvc.perform(delete("/api/autores/" + id)).andExpect(status().isOk());
        mockMvc.perform(get("/api/autores/" + id)).andExpect(status().isNotFound());
    }

    @Test
    void naoDeveExcluirAutorQueTemLivros() throws Exception {
        long autorId = criarAutor("Graciliano Ramos");
        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"Vidas Secas\",\"autor\":{\"id\":" + autorId + "}}"))
                .andExpect(status().isCreated());

        mockMvc.perform(delete("/api/autores/" + autorId)).andExpect(status().isConflict());
    }
}
