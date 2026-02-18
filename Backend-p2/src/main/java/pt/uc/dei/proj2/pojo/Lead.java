package pt.uc.dei.proj2.pojo;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.time.LocalDate;
import java.util.Date;

@XmlRootElement
public class Lead {

    private int id;
    private String titulo;
    private String descricao;
    private int estado;
    private LocalDate dataCriacao;

    public Lead() {
    }

    public Lead(int id, String titulo, String descricao, int estado) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.estado = estado;
        this.dataCriacao = LocalDate.now();
    }

    @XmlElement
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @XmlElement
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    @XmlElement
    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    @XmlElement
    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    @XmlElement
    public LocalDate getDataCriacao() {
        return dataCriacao;
    }


}
