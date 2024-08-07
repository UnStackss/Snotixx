const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'store',
    description: 'Get a link to the Snotix store',
    showHelp: true,
    
    async execute({ inter }) {
        // Crea un embed con il link dello store
        const storeEmbed = new EmbedBuilder()
            .setTitle('🛒 Visit the Snotix Store!')
            .setDescription('Check out the Snotix store for premium features and more.')
            .addFields(
                { name: 'Store Link', value: '[Click here to visit the store](https://discord.com/application-directory/1270321783349968978/store)' }
            )
            .setColor('#0099ff')
            .setFooter({
                text: 'Thank you for using Snotix!',
                iconURL: 'https://i.imgur.com/F2S7M7R.gif' // Sostituisci con l'URL dell'icona del tuo store
            });

        // Invia l'embed come risposta
        return inter.reply({ embeds: [storeEmbed] });
    }
}
