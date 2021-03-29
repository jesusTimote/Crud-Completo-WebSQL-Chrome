/*------ ----- Creacion de la base de datos ----- ------*/
let $db = openDatabase(
    "Carrito-Compra",
    "1.0",
    "database carrito",
    2 * 1024 * 1024
);

/*------ ----- Validar si existe ----- ------*/
let version;
!$db
    ? alert("Oops, tu Database no esta creada")
    : console.log((version = $db.version));

/*------ ----- Creaccion de la tabla ----- ------*/
$db.transaction((con) => {
    con.executeSql(
        "CREATE TABLE IF NOT EXISTS CATEGORIA (" +
        "id TEXT unique," +
        "nombre TEXT NOT NULL, categoria TEXT NOT NULL,descripcion text not null);"
    );
});

/*------ ----- Evento del botones ----- ------*/
const $form = document.getElementById("formulario");
let $categoria = document.getElementById("categoria");
let btnActualiza=document.getElementById("Actualiza")
let btnSave=document.getElementById("Save")

/*------ ----- Metodo guardar ----- ------*/

function Guardar() {
    document.addEventListener("click", (e) => {
        if (e.target.matches("#Save")) {
            let $id = document.getElementById("id").value,
                $nombre = document.getElementById("nombre").value,
                $cboCategoria = $categoria.options[$categoria.selectedIndex].value,
                $descripcion = document.getElementById("descripcion").value;

            if ($id == "" || $nombre == "" || $descripcion == "") {
                alert("Completa todos los campos");
            } else {
                alert("GUARDADO")
                $db.transaction((con) => {
                    con.executeSql(
                        "INSERT INTO CATEGORIA(id,nombre,categoria,descripcion)VALUES(?,?,?,?)",
                        [$id, $nombre, $cboCategoria, $descripcion]
                    );
                });
            }
        }
    });
    Listar();
}

/*------ ----- Metodo Listar ----- ------*/

function Listar() {
    $db.transaction((con) => {
        con.executeSql("SELECT *FROM CATEGORIA", [], (con, result) => {
            $("#example").DataTable({
                responsive: true,
                processing: true,
                destroy: true,
                data: result.rows,
                columns: [
                    {
                        data: null,
                        render(data, type, full, number) {
                            return number.row + 1;
                        },
                    },
                    { data: "id" },
                    { data: "nombre" },
                    { data: "categoria" },
                    { data: "descripcion" },
                    {
                        data: "id",
                        render(data) {
                            return (
                                "<a class='btn btn-success' onclick=Editar('" +
                                data +
                                "')  title='Editar'><i class='fas fa-edit'></i><a/> | <a class='btn btn-danger' onclick=Eliminar('" +
                                data +
                                "')><i class='fas fa-trash-alt'></i><a/>"
                            );
                        }
                    },
                ],
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json"
                },
            })
        })
    })
}


function Eliminar(codigo) {

    console.log(codigo);
    $db.transaction((con) => {
        con.executeSql("DELETE FROM CATEGORIA WHERE ID=?", [codigo]);
    });
    alert("ELIMINADO")
    Listar();
}

function Editar(codigo) {
    let $id = document.getElementById("id"),
        $nombre = document.getElementById("nombre"),
        $cboCategoria = $categoria.options[$categoria.selectedIndex],
        $descripcion = document.getElementById("descripcion");

    //  $id.value = codigo;

    $db.transaction((con) => {
        con.executeSql("SELECT * FROM CATEGORIA  WHERE ID=?", [codigo], (con, result) => {
            let row = result.rows[0];
            console.log(row);

            $id.value = row.id,
                $nombre.value = row.nombre,
                $cboCategoria.text = row.categoria,
                $descripcion.value = row.descripcion;
        });
    });
    btnActualiza.style.visibility = "visible";
   
    btnSave.style.display="none";

}

function Modifica() {
    let $id = document.getElementById("id").value,
        $nombre = document.getElementById("nombre").value,
        $cboCategoria = $categoria.options[$categoria.selectedIndex].value,
        $descripcion = document.getElementById("descripcion").value;

        $db.transaction((con) => {
            con.executeSql(
                "UPDATE categoria SET NOMBRE=?,categoria=?,descripcion=? WHERE ID=?",
                [$nombre, $cboCategoria, $descripcion, $id]
              
              );
        })
        alert("Modificado")

        btnActualiza.style.visibility = "hidden";
        btnSave.style.display="block";
        Listar();

}
const Actualiza = (document.getElementById("Actualiza").onclick = Modifica);
document.addEventListener("DOMContentLoaded", Guardar);
document.addEventListener("DOMContentLoaded", Listar);
