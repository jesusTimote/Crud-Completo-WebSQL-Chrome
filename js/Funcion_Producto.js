
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

/*------ ----- Creacion de la tabla ----- ------*/

$db.transaction((con) => {
    con.executeSql(
        "CREATE TABLE IF NOT EXISTS PRODUCTOS(" +
        "ID UNIQUE PRIMARY KEY ," +
        "CLIENTE TEXT NOT NULL," +
        "PROVEEDOR TEXT NOT NULL," +
        "PRODUCTO TEXT NOT NULL," +
        "PRECIO TEXT NOT NULL," +
        "STOCK TEXT NOT NULL);"

    );
})

/*------ ----- Eventos de botones ----- ------*/

let $producto = document.getElementById("producto");
let $btnActualizar = document.getElementById("Actualiza");
let $btnGuardar = document.getElementById("Guardar");
let $NomUsuario=document.getElementById("NomUsuario")

/*------ ----- Metodo de guardado ----- ------*/
function GuardarProducto() {
    document.addEventListener("click", e => {

        if (e.target.matches("#Guardar")) {

            let $codigo = document.getElementById("codigo").value,
                $cliente = document.getElementById("cliente").value,
                $proveedor = document.getElementById("proveedor").value,
                $cboproducto = $producto.options[$producto.selectedIndex].value,
                $precio = document.getElementById("precio").value,
                $stock = document.getElementById("stock").value;

            if ($codigo == "" || $cliente == "" || $proveedor == ""
                || $precio == "" || $stock == "") {
                alert("Complete todos los campos")
            } else if (Math.sign($precio) === -1 || Math.sign($stock) === -1) {
                alert("No Ingrese Numeros Negativos")
            } else {
                alert("! exito Guardado")
                $db.transaction((con) => {
                    con.executeSql(
                        "INSERT INTO PRODUCTOS(ID,CLIENTE,PROVEEDOR,PRODUCTO,PRECIO,STOCK)VALUES(?,?,?,?,?,?)",
                        [$codigo, $cliente, $proveedor, $cboproducto, $precio, $stock]
                    );
                })

            }


        }
    })
    ListadoProducto();
}

/*------ ----- Metodo Listado Producto----- ------*/

function ListadoProducto() {
    $db.transaction((con) => {
        con.executeSql("SELECT * FROM PRODUCTOS", [], (con, result) => {
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
                    { data: "ID" },
                    { data: "CLIENTE" },
                    { data: "PROVEEDOR" },
                    { data: "PRODUCTO" },
                    { data: "PRECIO" },
                    { data: "STOCK" },
                    {
                        data: "ID",
                        render(data) {
                            return (
                                "<a class='btn btn-success' onclick=Editar('" +
                                data +
                                "')  title='Editar'><i class='fas fa-edit'></i><a/> | <a class='btn btn-danger' onclick=Eliminar('" +
                                data +
                                "')><i class='fas fa-trash-alt'></i><a/>"
                            );
                        },
                    },
                ],
            })
        })
    })

}


/*------ -----Metodo Listado Combo Categoria ----- ------*/

function ListaCboCategoria() {
    $producto.innerHTML = "";
    $db.transaction((con) => {
        con.executeSql(
            "SELECT * FROM CATEGORIA ", [], (con, result) => {
                $producto.innerHTML += `<option selected disabled>---- Eliga Producto ----</option>`;

                for (lista of result.rows) {
                    $producto.innerHTML += `<option value='${lista.nombre}'>${lista.nombre}</option>`;
                }
            })
    })
}

/*------ -----Metodo Eliminar Producto ----- ------*/

function Eliminar(codigo) {
    alert("eliminado")
    $db.transaction((con) => {
        con.executeSql(
            "DELETE FROM PRODUCTOS WHERE ID=?", [codigo]
        );
        ListadoProducto();
    })
}

/*------ ----- Metodo Editar Producto ----- ------*/

function Editar(codigo) {
    let $codigo = document.getElementById("codigo"),
        $cliente = document.getElementById("cliente"),
        $proveedor = document.getElementById("proveedor"),
        $cboproducto = $producto.options[$producto.selectedIndex],
        $precio = document.getElementById("precio"),
        $stock = document.getElementById("stock");

    $db.transaction((con) => {
        con.executeSql(
            "SELECT * FROM PRODUCTOS WHERE ID=?", [codigo], (con, result) => {
                let rows = result.rows[0];
                console.log(rows);
                $codigo.value = rows.ID;
                $cliente.value = rows.CLIENTE;
                $proveedor.value = rows.PROVEEDOR;
                $cboproducto.text = rows.PRODUCTO;
                $precio.value = rows.PRECIO;
                $stock.value = rows.STOCK;

            })
    })

    $btnActualizar.style.visibility = "visible";
    $btnGuardar.style.display = "none";
}

/*------ ----- Metodo Modificar  ----- ------*/

function Modifica() {
    let $codigo = document.getElementById("codigo").value,
        $cliente = document.getElementById("cliente").value,
        $proveedor = document.getElementById("proveedor").value,
        $cboproducto = $producto.options[$producto.selectedIndex].value,
        $precio = document.getElementById("precio").value,
        $stock = document.getElementById("stock").value;

    $db.transaction((con) => {
        con.executeSql(
            "UPDATE PRODUCTOS SET CLIENTE=?,PROVEEDOR=?,PRODUCTO=?,PRECIO=?,STOCK=? WHERE ID=?",
            [$cliente, $proveedor, $cboproducto, $precio, $stock, $codigo]
        )
    })
    alert("Modificado")
    $btnActualizar.style.visibility = "hidden";
    $btnGuardar.style.display = "block"
    ListadoProducto();
}
/*
function Usuario(){
    $NomUsuario.innerHTML="";
    $db.transaction((con)=>{
        con.executeSql("select * from usuario",[],(con,result)=>{
           $NomUsuario.innerHTML +=`Nombre : ${result.rows[0].NOMBRE}`

        })
    })
}
*/


/*------ ----- Evento DOM ----- ------*/
document.addEventListener("DOMContentLoaded", GuardarProducto);
document.addEventListener("DOMContentLoaded", ListadoProducto);
document.addEventListener("DOMContentLoaded", ListaCboCategoria);
const Actualiza = (document.getElementById("Actualiza").onclick = Modifica);
document.addEventListener("DOMContentLoaded", Usuario);

