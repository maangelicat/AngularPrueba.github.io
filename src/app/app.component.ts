import { Component } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  public headersTable: any[] = []; //Para los Headers de la Tabla
  public linesR: any[] = []; // Cada una de las filas de la tabla
  public foods: any[] = [];
  public separador: any [] | undefined ;
  errorMessage: string;
  successMessage: string;
  constructor(private http: HttpClient) {}

  seleccionarOpcion() {
    console.log('Opción seleccionada:', this.separador);
  }
  //Funcion para cargar archivos
  changeListener(files: FileList) {
    if (files && files.length > 0) {
      let file: File = files.item(0) as File;

      //Leer la informacion del archivo
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: any = reader.result;
        let allTextLines = [];
        allTextLines = csv
          .split(/\r|\n|\r/)
          .filter((line: string) => line != '');

        //Headers de la Tabla
        this.headersTable = allTextLines[0].split(this.separador);

        // Filas de la Tabla
        let tarrR = [];

        let arrl = allTextLines.length;
        let rows = [];

        // Se llenan las filas de la tabla
        for (let i = 1; i < arrl; i++) {
          rows.push(allTextLines[i].split(this.separador));
        }

        // Se llenan las Columnas de cada fila
        for (let j = 0; j < arrl - 1; j++) {
          tarrR.push(rows[j]);
        }

        //Se llenan las filas de la tabla final
        this.linesR.push(tarrR);
        console.log(this.linesR);
        console.log(this.headersTable);
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
        this.http.post('http://localhost:3000/personas',this.linesR, {headers}).subscribe(
          (response) => {
            console.log('Persona creada:', response);
            // Realiza las acciones necesarias con la respuesta
          },
          (error) => {
            console.error('Error al crear persona:', error);
            // Realiza el manejo de errores
          }

        );
      };
    }
  }
}
