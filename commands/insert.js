module.exports = {
    name: 'insert',
    description: 'Registra la incidencia de un usuario',
    execute(message, args, loadData, saveData){
        const data = loadData();

        if(args.length > 0){

            const campos = {};
            args.forEach(element => {
                const [clave, ...valor] = element.split(':');
                if (clave && valor.length) {
                    campos[clave.toLowerCase()] = valor.join(':').toLowerCase();
                }
            });

              // Validar que todos los campos estén presentes
            if (!campos.nombre || !campos.motivo) {
                return message.reply('❌ Faltan campos. Usa: `!insert nombre:GreenMonster motivo:Viaje`');
            }

            // Inicializar el objeto de incidencias si no existe
            if (!data.incidencias) {
                data.incidencias = [];
            }

            const date = new Date(Date.now());
            
            const incidencia = {
                nombre: campos.nombre,
                fecha: date.toISOString(),
                motivo: campos.motivo,
                registradoPor: message.author.username
            };
    
            data.incidencias.push(incidencia);

            saveData(data);

            message.reply('Datos actualizados');
        }else{
            message.reply('Error');
        }
    }
}