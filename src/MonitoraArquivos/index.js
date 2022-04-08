import chokidar from 'chokidar'
import fs from 'fs'
import fileSize from 'filesize'
import path from 'path'
import { api } from '../services/api.js'

const auth = {
  username: process.env.USUARIO,
  password: process.env.SENHA
}

function Monitorar() {
  let watcher = chokidar.watch(process.env.DIRETORIO_BKP, { ignoreInitial: true })

  watcher
    .on('add', async novo_arquivo => {

      const { size, mtime } = fs.statSync(novo_arquivo);
      const nome_arquivo = path.basename(novo_arquivo);
      const id_empresa = process.env.ID_EMPRESA

      await api.post('/bkps', {
        id_empresa: id_empresa,
        nome_arquivo: nome_arquivo,
        data_arquivo: new Date(mtime).toLocaleDateString(),
        hora_arquivo: String(new Date(mtime).getHours()),
        minuto_arquivo: String(new Date(mtime).getMinutes()),
        tamanho_arquivo: fileSize(size),
        caminho_completo: path.resolve(novo_arquivo)
      }, { auth })
        .then(response => {
          console.log(response?.data)
        })
        .then(error => {
          console.log(error?.response?.data)
        })

    })


}


export default Monitorar