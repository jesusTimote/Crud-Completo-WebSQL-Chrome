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
        "CREATE TABLE IF NOT EXISTS USUARIO(" +
        "NOMBRE UNIQUE PRIMARY KEY ," +
        "USUARIO TEXT NOT NULL," +
        "CONTRASEÑA TEXT NOT NULL);"
    );
})

function GuardarRegistrar() {
    document.addEventListener("click", e => {
        if (e.target.matches("#Save")) {
            let $nombre = document.getElementById("nombre").value,
                $usuario = document.getElementById("usuario").value,
                $contraseña = document.getElementById("contraseña").value,
                $repetir = document.getElementById("repetir").value;

            if ($nombre == "" || $usuario == "" || $contraseña == "" || $repetir == "") {
                alert("Complete todos los campos")

            } else if (!($contraseña == $repetir)) {
                alert("Las Contraseñas no coinciden")
            } else {
                try {
                    $db.transaction((con) => {
                        con.executeSql(
                            "INSERT INTO USUARIO (NOMBRE,USUARIO,CONTRASEÑA) VALUES (?,?,?)",
                            [$nombre, $usuario, $contraseña]
                        )
                    })
                    alert("exito")
                    window.location = "index.html";
                } catch (error) {
                    alert("No se ha registrado")
                }
            }

        }
    })
}


/*------ -----Metodo Login ----- ------*/
function Iniciar() {
    document.addEventListener("click", e => {
        
        if (e.target.matches("#Iniciar")) {
            let usu = document.getElementById("usuario").value
            let cont = document.getElementById("contraseña").value
            let acceso = false;
            $NombreUsuario ="";
            $db.transaction((con) => {
                con.executeSql(
                    "select * from USUARIO WHERE USUARIO=? and CONTRASEÑA=?", [usu, cont], (con, result) => {
                        let rows = result.rows;
                            for(let i=0;i<rows.length;i++){
                                if(rows[i].USUARIO==usu && rows[i].CONTRASEÑA==cont){
                                  
                                    sessionStorage.setItem("usuarioActivo", rows[i].NOMBRE)
                                  
                                    acceso = true;
                                }
                            }
                 

                        if (acceso) {
                            alert(`Bienvenido ${rows[0].NOMBRE}`)
                            window.location = "Producto.html"
                        }else {
                            alert("Error Contraseña y usuario Incorrecto")
                        }
                    })
                        return acceso
            })

        }
    })
}


document.addEventListener("DOMContentLoaded", GuardarRegistrar);
document.addEventListener("DOMContentLoaded", Iniciar);
