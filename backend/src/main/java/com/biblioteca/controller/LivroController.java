package com.biblioteca.controller;

import com.biblioteca.model.Autor;
import com.biblioteca.model.Livro;
import com.biblioteca.repository.AutorRepository;
import com.biblioteca.repository.LivroRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "*")
public class LivroController {

    private final LivroRepository livroRepository;
    private final AutorRepository autorRepository;

    public LivroController(LivroRepository livroRepository, AutorRepository autorRepository) {
        this.livroRepository = livroRepository;
        this.autorRepository = autorRepository;
    }

    /** O JSON traz so o id do autor: "autor": {"id": 1}. Aqui buscamos o autor completo. */
    private Autor resolverAutor(Autor autorInformado) {
        if (autorInformado == null || autorInformado.getId() == null) {
            return null;
        }
        return autorRepository.findById(autorInformado.getId()).orElse(null);
    }

    @PostMapping
    public ResponseEntity<Livro> criar(@Valid @RequestBody Livro livro) {
        Autor autor = resolverAutor(livro.getAutor());
        if (autor == null) {
            return ResponseEntity.badRequest().build(); // autor inexistente
        }
        livro.setId(null);
        livro.setAutor(autor);
        return ResponseEntity.status(HttpStatus.CREATED).body(livroRepository.save(livro));
    }

    @GetMapping
    public List<Livro> listar() {
        return livroRepository.findAllByOrderByTituloAsc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscar(@PathVariable Long id) {
        return livroRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // (extra) livros de um autor
    @GetMapping("/autor/{autorId}")
    public List<Livro> listarPorAutor(@PathVariable Long autorId) {
        return livroRepository.findByAutorId(autorId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livro> atualizar(@PathVariable Long id, @Valid @RequestBody Livro dados) {
        Optional<Livro> existente = livroRepository.findById(id);
        if (existente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Autor autor = resolverAutor(dados.getAutor());
        if (autor == null) {
            return ResponseEntity.badRequest().build();
        }
        Livro livro = existente.get();
        livro.setTitulo(dados.getTitulo());
        livro.setIsbn(dados.getIsbn());
        livro.setAnoPublicacao(dados.getAnoPublicacao());
        livro.setGenero(dados.getGenero());
        livro.setAutor(autor); // atualiza tambem o autor
        return ResponseEntity.ok(livroRepository.save(livro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!livroRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        livroRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
