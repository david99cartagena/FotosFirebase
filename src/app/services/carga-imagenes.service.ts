/* import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FileItem } from '../models/file-item';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class CargaImagenesService {
  private CARPETA_IMAGENES = 'img';

  constructor(private db: AngularFirestore) {}

  cargarImagenesFirebase(imagenes: FileItem[]) {
    const storageRef = firebase.storage().ref();

    for (const item of imagenes) {
      item.estaSubiendo = true;

      if ((item.progreso ?? 0) >= 100) {
        continue;
      }

      if (!item.archivo) {
        console.log(`El archivo para ${item.nombreArchivo} es undefined.`);
        item.estaSubiendo = false;
        continue;
      }

      const uploadTask: firebase.storage.UploadTask = storageRef
        .child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
        .put(item.archivo);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => {
          item.progreso =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => console.error('Error al subir', error),
        async () => {
          console.log('Imagen cargada correctamente');
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          item.url = url;
          item.estaSubiendo = false;
          this.guardarImagen({
            nombre: item.nombreArchivo ?? '',
            url: item.url ?? '',
          });
        }
      );
    }
  }

  private guardarImagen(imagen: { nombre: string; url: string }) {
    this.db.collection(`/${this.CARPETA_IMAGENES}`).add(imagen);
  }
} */

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FileItem } from '../models/file-item';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CargaImagenesService {
  private CARPETA_IMAGENES = 'img';

  constructor(private db: AngularFirestore) {}

  /* async cargarImagenesFirebase(imagenes: FileItem[]) {
    // 1️⃣ Obtener cantidad de imágenes ya existentes
    const fotos = await this.db
      .collection(this.CARPETA_IMAGENES)
      .valueChanges()
      .pipe(take(1))
      .toPromise();

    const cantidadExistente = fotos?.length ?? 0;

    if (cantidadExistente + imagenes.length > 20) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: `No puedes subir más de 20 imágenes. Ya hay ${cantidadExistente} cargadas.`,
      });
      return;
    }

    const storageRef = firebase.storage().ref();

    for (const item of imagenes) {
      if (!item.archivo) {
        console.warn(`El archivo para ${item.nombreArchivo} es undefined.`);
        item.estaSubiendo = false;
        continue;
      }

      // ✅ Validar extensión
      const extension = item.archivo.name.split('.').pop()?.toLowerCase();
      if (!['png', 'jpg', 'jpeg'].includes(extension ?? '')) {
        Swal.fire({
          icon: 'error',
          title: 'Formato inválido',
          text: `La imagen "${item.nombreArchivo}" no es .png, .jpg o .jpeg.`,
        });
        item.estaSubiendo = false;
        continue;
      }

      // ✅ Validar tamaño máximo 5MB
      const maxSize = 5 * 1024 * 1024; // 5 MB en bytes
      if (item.archivo.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo muy grande',
          text: `La imagen "${item.nombreArchivo}" supera los 5 MB.`,
        });
        item.estaSubiendo = false;
        continue;
      }

      item.estaSubiendo = true;

      const uploadTask = storageRef
        .child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
        .put(item.archivo);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          item.progreso =
            ((snapshot?.bytesTransferred ?? 0) / (snapshot?.totalBytes ?? 1)) *
            100;
        },
        (error) => {
          console.error('Error al subir', error);
          item.estaSubiendo = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo subir la imagen "${item.nombreArchivo}".`,
          });
        },
        async () => {
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          item.url = url;
          item.estaSubiendo = false;

          this.guardarImagen({
            nombre: item.nombreArchivo ?? '',
            url: item.url ?? '',
          });

          Swal.fire({
            icon: 'success',
            title: 'Imagen subida',
            text: `La imagen "${item.nombreArchivo}" se subió correctamente.`,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      );
    }
  } */

  async cargarImagenesFirebase(imagenes: FileItem[]) {
    // 1️⃣ Obtener cantidad de imágenes ya existentes
    const fotos = await this.db
      .collection(this.CARPETA_IMAGENES)
      .valueChanges()
      .pipe(take(1))
      .toPromise();

    const cantidadExistente = fotos?.length ?? 0;

    if (cantidadExistente + imagenes.length > 20) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: `No puedes subir más de 20 imágenes. Ya hay ${cantidadExistente} cargadas.
        👋Elimina alguna foto para subir otra.`,
      });
      return;
    }

    const storageRef = firebase.storage().ref();

    const subidasExitosas: string[] = [];
    const subidasFallidas: string[] = [];

    const promesasSubida = imagenes.map(async (item) => {
      if (!item.archivo) {
        console.warn(`El archivo para ${item.nombreArchivo} es undefined.`);
        item.estaSubiendo = false;
        subidasFallidas.push(item.nombreArchivo ?? 'Archivo desconocido');
        return;
      }

      // ✅ Validar extensión
      const extension = item.archivo.name.split('.').pop()?.toLowerCase();
      if (!['png', 'jpg', 'jpeg'].includes(extension ?? '')) {
        subidasFallidas.push(item.nombreArchivo ?? 'Archivo desconocido');
        item.estaSubiendo = false;
        return;
      }

      // ✅ Validar tamaño máximo 5MB
      const maxSize = 5 * 1024 * 1024; // 5 MB en bytes
      if (item.archivo.size > maxSize) {
        subidasFallidas.push(item.nombreArchivo ?? 'Archivo desconocido');
        item.estaSubiendo = false;
        return;
      }

      item.estaSubiendo = true;

      const uploadTask = storageRef
        .child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
        .put(item.archivo);

      return new Promise<void>((resolve) => {
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            item.progreso =
              ((snapshot?.bytesTransferred ?? 0) /
                (snapshot?.totalBytes ?? 1)) *
              100;
          },
          (error) => {
            console.error('Error al subir', error);
            item.estaSubiendo = false;
            subidasFallidas.push(item.nombreArchivo ?? 'Archivo desconocido');
            resolve();
          },
          async () => {
            const url = await uploadTask.snapshot.ref.getDownloadURL();
            item.url = url;
            item.estaSubiendo = false;

            // 🔹 Variables intermedias para asegurar que son strings
            const nombre: string = item.nombreArchivo ?? '';
            const enlace: string = item.url ?? '';

            this.guardarImagen({ nombre, url: enlace });

            subidasExitosas.push(nombre);
            resolve();
          }
        );
      });
    });

    // Esperar a que todas las subidas terminen
    await Promise.all(promesasSubida);

    // Mostrar un solo Swal con todos los resultados
    let mensaje = '';

    if (subidasExitosas.length) {
      mensaje += 'Se subieron:\n';
      mensaje += subidasExitosas.map((nombre) => `✅ ${nombre}`).join('\n');
    }

    if (subidasFallidas.length) {
      mensaje += '\n Fallaron: \n';
      mensaje += subidasFallidas.map((nombre) => `❌ ${nombre}`).join('\n');
    }

    Swal.fire({
      icon: subidasFallidas.length ? 'warning' : 'success',
      title: 'Resultado de la subida',
      html: mensaje.replace(/\n/g, '<br>'), // Swal necesita <br> para saltos de línea
      timer: 3000,
      showConfirmButton: false,
    });
  }

  async eliminarImagen(idDoc: string, nombreArchivo: string) {
    try {
      // 1️⃣ Borrar archivo en Storage
      const storageRef = firebase.storage().ref();
      await storageRef
        .child(`${this.CARPETA_IMAGENES}/${nombreArchivo}`)
        .delete();

      // 2️⃣ Borrar documento en Firestore
      await this.db.collection(this.CARPETA_IMAGENES).doc(idDoc).delete();

      console.log(`Imagen ${nombreArchivo} eliminada correctamente`);
    } catch (error) {
      console.error('Error eliminando imagen', error);
    }
  }

  private guardarImagen(imagen: { nombre: string; url: string }) {
    this.db.collection(`/${this.CARPETA_IMAGENES}`).add(imagen);
  }
}
