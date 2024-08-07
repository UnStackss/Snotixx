const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Get an invite link to add the bot to your server.',
    
    async execute({ inter }) {
        // URL dell'invito del bot
        const inviteURL = 'https://discord.com/api/oauth2/authorize?client_id=1270321783349968978&permissions=8&scope=bot'; // Sostituisci YOUR_CLIENT_ID con l'ID del tuo bot

        // Crea un embed con il link di invito
        const inviteEmbed = new EmbedBuilder()
            .setTitle('🤖 Add Snotix to Your Server!')
            .setDescription('Click the link below to invite Snotix to your own Discord server.')
            .addFields(
                { name: 'Invite Link', value: `[Add Snotix to Your Server](${inviteURL})` }
            )
            .setColor('#0099ff')
            .setFooter({
                text: 'Thank you for using Snotix!',
                iconURL: 'https://i.imgur.com/9yeAYSL.png' // Sostituisci con l'URL dell'icona del tuo bot
            });

        // Rispondi con l'embed
        return inter.reply({ embeds: [inviteEmbed] });
    }
}
