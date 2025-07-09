const {EmbedBuilder} = require('discord.js');

module.exports = {
    name: 'select',
    description: 'lee los datos y los muestra',
    execute(message, args, loadData){
        const data = loadData();
        
        /*
        const response = [];
        response = data.incidencias;
        */

        const embed = new EmbedBuilder().setColor(0x0099ff)
        .setTitle('📋 Lista de Incidencias')
        .setDescription('Aquí están las incidencias registradas:')
        .setTimestamp();

        data.incidencias.forEach(element => {
            embed.addFields({
                name: `Jugador :`,
                value: `  ${element.nombre}`,
                inline: false
            }, 
            {
                name: `Motivo :`,
                value: `  ${element.motivo}`,
                inline: false
            }, 
            {
                name: `Fecha :`,
                value: `  ${element.fecha}`,
                inline: false
            } );
        });

        message.reply({ embeds: [embed]});
    }
}