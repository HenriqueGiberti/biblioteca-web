package com.biblioteca.controller;

import com.biblioteca.model.Autor;
import com.biblioteca.repository.AutorRepository;
import com.biblioteca.repository.LivroRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/autores")
@CrossOrigin(origins = "*")
public class AutorController {

    private final AutorRepository autorRepository;
    private final LivroRepository livroRepository;

    public AutorController(AutorRepository autorRepository, LivroRepository livroRepository) {
        this.autorRepository = autorRepository;
        this.livroRepository = livroRepository;
    }

    @PostMapping
    public ResponseEntity<Autor> criar(@Valid @RequestBody Autor autor) {
        autor.setId(null); // garante que e um INSERT
        Autor salvo = autorRepository.save(autor);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public List<Autor> listar() {
        return autorRepository.findAllByOrderByNomeAsc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Autor> buscar(@PathVariable Long id) {
        return autorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Autor> atualizar(@PathVariable Long id, @Valid @RequestBody Autor dados) {
        Optional<Autor> existente = autorRepository.findById(id);
        if (existente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Autor autor = existente.get();
        autor.setNome(dados.getNome());
        autor.setNacionalidade(dados.getNacionalidade());
        autor.setDataNascimento(dados.getDataNascimento());
        return ResponseEntity.ok(autorRepository.save(autor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!autorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // (extra) resposta amigavel: 409 em vez de erro 500 da FK
        if (livroRepository.existsByAutorId(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        autorRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
