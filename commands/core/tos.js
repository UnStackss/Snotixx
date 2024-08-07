const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'tos',
    description: 'Display the terms of service and the privacy policy',
    showHelp: false,

    async execute({ client, inter }) {
        try {
            // Differire la risposta per dare tempo di preparare l'embed
            await inter.deferReply();

            // Crea l'embed con le informazioni del bot
            const embed = new EmbedBuilder()
                .setColor('#1E90FF') // Colore dell'embed
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL({
                        size: 1024,
                        dynamic: true,
                    }),
                })
                .setTitle('Terms of Service & Privacy Policy') // Titolo dell'embed
                .setDescription(
                    'Please review the following documents for information about our terms and policies:'
                )
                .addFields([
                    {
                        name: 'Terms of Service',
                        value: '[Click here to read the Terms of Service](https://owofufu.dev/tos/tos.html)',
                    },
                    {
                        name: 'Privacy Policy',
                        value: '[Click here to read the Privacy Policy](https://owofufu.dev/pp/pp.html)',
                    },
                ])
                .setTimestamp()
                .setFooter({
                    text: 'Snotix - Crafted with care by UnStackss <3',
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                });

            // Risponde con l'embed
            await inter.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing tos command:', error);
            if (!inter.replied) {
                await inter.editReply({ content: 'There was an error trying to execute this command. Please try again later.' });
            }
        }
    },
};
