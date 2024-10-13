
//--------------Son las dependencias no les hagan caso-------------------//
const express = require("express");
const app = express();
const PORT = process.env.PORT ?? 3000;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
//-----------------------------------------------------------------------//


app.use(express.json());
/*
*Posible mejora, mejor manejo de errores en los catch, ya que no hay informacion sufiente sobre los errores
*Console.log(error), posible solucion para obtener mas detalles
*/
app.get("/empleados", async (req, res) => {
  try {
    const empleados = await prisma.empleados.findMany();
    res.json(empleados);
  } catch (error) {
    res.status(404).json({ error: "Error al obtener los empleados" });
  }
});
/*
* En este caso lo ideal seria primero verificar que el empleado exista realmente,
* ya que el finUnique en el caso que no exista, devuelve un null, y no seria lo ideal.
* Posible solucion una condicion que verifique si esta vacio, devuelva "Empleado no encontrado".
* if (!empleado) {
  *  return res.status(404).json({ error: "Empleado no encontrado." });
  *  }
  * Importante: Lo ideal seria realizar la misma verificacion tanto en el PUT como en el DELETE.
*/
app.get("/empleados/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const empleados = await prisma.empleados.findUnique({
      where: { id: Number(id) },
    });
 
    res.json(empleados);
  } catch (error) {
    res.status(404).json({ error: "Error al obtener los empleados" });
  }
});
/*
  * Posible mejora, validar los campos de nombre,apellido,puesto antes de procesarlos.
  * if (!nombre || !apellido || !puesto) {
  *  return res.status(400).json({ error: "Todos los campos deben ser obligatorios (nombre, apellido, puesto)." });
  *  }
  */
app.post("/empleados", async (req, res) => {
  const { nombre, apellido, puesto, sueldo } = req.body;
  const sueldoParseado = parseFloat(sueldo);

  if (isNaN(sueldoParseado)) {
    return res
      .status(400)
      .json({ error: "El sueldo debe ser un número válido" });
  }

  try {
    const empleado = await prisma.empleados.create({
      data: {
        nombre,
        apellido,
        puesto,
        sueldo: sueldoParseado,
      },
    });
    res.status(201).json(empleado);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el empleado" });
  }
});

app.put("/empleados/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, puesto, sueldo } = req.body;
  const sueldoParseado = parseFloat(sueldo);

  if (isNaN(sueldoParseado)) {
    return res
      .status(400)
      .json({ error: "El sueldo debe ser un número válido" });
  }

  try {
    const empleado = await prisma.empleados.update({
      where: { id: Number(id) },
      data: { nombre, apellido, puesto, sueldo: sueldoParseado },
    });
    res.json(empleado);
  } catch (error) {
    res.status(404).json({ error: "Error al actualizar el empleado" });
  }
});

app.delete("/empleados/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const empleados = await prisma.empleados.delete({
      where: { id: Number(id) },
    });
    res.json(empleados);
  } catch (error) {
    res.status(404).json({ error: "Error al eliminar al empleado" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});