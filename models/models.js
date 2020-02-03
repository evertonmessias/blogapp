const mongoose = require("mongoose");

//Models
const categoria = mongoose.Schema({
    nome: { type: String, require: true },
    slug: { type: String, require: true },
    data: { type: Date, default: Date.now()}
});

const post = mongoose.Schema({
    titulo: { type: String, require: true },
    slug: { type: String, require: true },
    descricao: {type: String, require: true},
    conteudo:{type: String, require: true},
    categoria:{type: mongoose.Schema.Types.ObjectId, ref: "categorias",require: true},
    data: { type: Date, default: Date.now()}
});

const usuario = mongoose.Schema({
    nome: { type: String, require: true },
    email: { type: String, require: true },
    senha: { type: String, require: true },
    admin: { type: Boolean, default: false}
});

//Collection
mongoose.model('categorias', categoria);
mongoose.model('posts', post);
mongoose.model('usuarios', usuario);