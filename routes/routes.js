const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const md5 = require('md5');
require("../models/models");
const categoria = mongoose.model("categorias");
const posts = mongoose.model("posts");
const usuarios = mongoose.model("usuarios");
var logado = false;
var admin = false;
var usuariologado = "";

router.get('/', (req, res) => {    
    res.render("index", { logado: logado, usuariologado: usuariologado });
});

router.get('/alert', (req, res) => {
    res.render("alert");
});

router.get('/logout', (req,res)=>{
    res.render("index",{logado: false,admin:false,usuariologado:""});
});

//usuario

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/usuario", (req, res) => {
    res.render("usuario");
});

router.post("/login/in", (req, res) => {
    usuarios.findOne({ nome: req.body.nome }, (erro, user) => {
        if (user) {
            var senha = md5(req.body.senha);
            if (user.senha == senha) {
                usuariologado = user.nome;
                logado = true;
                if(user.admin){
                    admin = true;
                }
                res.redirect("/");
            } else {
                console.log("Senha Inválida!!!");
                res.redirect("/login");
            }
        } else {
            console.log("Usuário Inválido!!!");
            res.redirect("/login");
        }
    })
})

//inserir usuario
router.post("/usuario/novo", (req, res) => {
    usuarios.findOne({ nome: req.body.nome }, (erro, achou) => {
        if (!achou) {
            if ((req.body.nome.length > 2) && (req.body.email.length > 2) && (req.body.senha == req.body.senha2)) {
                const novousuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: md5(req.body.senha)
                }
                new usuarios(novousuario).save()
                    .then(() => {
                        res.render("alert", { msgok: "Usuario Criado com sucesso!", link: "/" });
                    })
                    .catch((err) => {
                        res.send("Erro ao Criar categoria" + err);
                    })
            } else {
                res.render("alert", { msgerro: "Digite os Valores corretamente!", link: "/" });
            }
        } else {
            res.render("alert", { msgerro: "Usuario já existe!", link: "/" });
        }
    });
});

//listar categorias
router.get("/categorias", (req, res) => {
    categoria.find((erro, tudo) => {
        res.render("categorias", { tudo: tudo, logado: logado, admin: admin });
    });
});

//listar posts
router.get("/posts", (req, res) => {
    posts.find((erro, tudo) => {
        res.render("posts", { tudo: tudo, logado: logado, admin: admin });
    }).populate("categoria").sort({ data: "desc" })
});

//inserir categoria
router.get("/categorias/add", (req, res) => {
    res.render("categoriasadd");
});
router.post("/categorias/nova", (req, res) => {
    if (req.body.nome && req.body.slug) {
        const novacategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new categoria(novacategoria).save()
            .then(() => {
                res.render("alert", { msgok: "Categoria Criada com sucesso!", link: "/categorias" });
            })
            .catch((err) => {
                res.send("Erro ao Criar categoria" + err);
            })
    } else {
        res.render("alert", { msgerro: "Digite os Valores corretamente!", link: "/categorias" });
    }
});

//inserir posts
router.get("/posts/add", (req, res) => {
    categoria.find((erro, tudo) => {
        res.render("postsadd", { tudo: tudo });
    });
});
router.post("/posts/novo", (req, res) => {
    if (req.body.titulo && req.body.slug) {
        const novoposts = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new posts(novoposts).save()
            .then(() => {
                res.render("alert", { msgok: "Post Criado com sucesso!", link: "/posts" });
            })
            .catch((err) => {
                res.send("Erro ao Criar Post" + err);
            })
    } else {
        res.render("alert", { msgerro: "Digite os Valores corretamente!", link: "/posts" });
    }
});


//editar categoria
router.get("/categorias/edit/:id", (req, res) => {
    var id = req.params.id;
    categoria.findOne({ _id: id }, (erro, tudo) => {
        if (!erro) {
            res.render("categoriasedit", { tudo: tudo });
        } else {
            res.render("alert", { msgerro: "Categoria não encontrada!", link: "/categorias" });
        }
    });
});
router.post("/categorias/edit", (req, res) => {
    var id = req.body.id;
    categoria.findOne({ _id: id }, (erro, categ) => {
        if (!erro) {
            if (req.body.nome && req.body.slug) {
                categ.nome = req.body.nome
                categ.slug = req.body.slug
                categ.save()
                    .then(() => {
                        res.render("alert", { msgok: "Categoria Editada com sucesso!", link: "/categorias" });
                    })
                    .catch((err) => {
                        res.send("Erro ao criar categoria" + err);
                    })
            } else {
                res.render("alert", { msgerro: "Digite os valores corretamente!", link: "/categorias" });
            }
        } else {
            res.render("alert", { msgerro: "Categoria não encontrada!", link: "/categorias" });
        }
    })
});

//editar posts
router.get("/posts/edit/:id", (req, res) => {
    var id = req.params.id;
    posts.findOne({ _id: id }, (erro, tudo) => { // erros não tratados com if
        categoria.find((erro, tcateg) => {
            res.render("postsedit", { tudo: tudo, tcateg: tcateg });
        })
    }).populate("categoria");
});
router.post("/posts/edit", (req, res) => {
    var id = req.body.id;
    posts.findOne({ _id: id }, (erro, postagem) => {
        if (!erro) {
            if (req.body.titulo && req.body.slug) {
                postagem.titulo = req.body.titulo
                postagem.slug = req.body.slug
                postagem.descricao = req.body.descricao
                postagem.categoria = req.body.categoria
                postagem.conteudo = req.body.conteudo
                postagem.save()
                    .then(() => {
                        res.render("alert", { msgok: "Post Editado com sucesso!", link: "/posts" });
                    })
                    .catch((err) => {
                        res.send("Erro ao criar postagem" + err);
                    })
            } else {
                res.render("alert", { msgerro: "Digite os valores corretamente!", link: "/posts" });
            }
        } else {
            res.render("alert", { msgerro: "Post não encontrado!", link: "/posts" });
        }
    })
});

//apagar categoria
router.get("/categorias/del/:id", (req, res) => {
    var id = req.params.id;
    categoria.deleteOne({ _id: id }, (erro, tudo) => {
        if (!erro) {
            res.render("alert", { msgok: "Categoria Apagada com sucesso!", link: "/categorias" });
        } else {
            res.render("alert", { msgerro: "Categoria não encontrada!", link: "/categorias" });
        }
    });
});

//apagar post
router.get("/posts/del/:id", (req, res) => {
    var id = req.params.id;
    posts.deleteOne({ _id: id }, (erro, tudo) => {
        if (!erro) {
            res.render("alert", { msgok: "Post Apagado com sucesso!", link: "/posts" });
        } else {
            res.render("alert", { msgerro: "Post não encontrado!", link: "/posts" });
        }
    });
});

// *****************************************
module.exports = router;