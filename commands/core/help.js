const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "help",
    description: "Displays all the available commands for Snotix!",
    showHelp: true,

    async execute({ client, inter }) {
        try {
            // Filtra i comandi che devono essere mostrati
            const commands = client.commands.filter((x) => x.showHelp !== false);
            const commandList = commands.map((cmd) => `\`${cmd.name}\` - ${cmd.description}`).join("\n");

            // Funzione per suddividere il testo in blocchi
            const splitText = (text, maxLength) => {
                const result = [];
                while (text.length > maxLength) {
                    let pos = text.lastIndexOf("\n", maxLength);
                    if (pos === -1) pos = maxLength;
                    result.push(text.slice(0, pos));
                    text = text.slice(pos).trim();
                }
                result.push(text);
                return result;
            };

            const chunks = splitText(commandList, 1024 - 50); // 50 per spazio extra (titoli, footer, ecc.)

            const embeds = chunks.map((chunk, index) => {
                return new EmbedBuilder()
                    .setColor("#1E90FF")
                    .setAuthor({
                        name: client.user.username,
                        iconURL: client.user.displayAvatarURL({
                            size: 1024,
                            dynamic: true,
                        }),
                    })
                    .setTitle("Snotix Bot - Command List")
                    .setDescription(
                        "Here are all the commands you can use with Snotix! If you need further assistance, feel free to reach out to our support server."
                    )
                    .addFields({
                        name: `Commands (${commands.size}) ${index + 1}/${chunks.length}`,
                        value: chunk,
                    })
                    .setTimestamp()
                    .setFooter({
                        text: "Snotix - Crafted with care by UnStackss <3",
                        iconURL: inter.member.displayAvatarURL({ dynamic: true }),
                    });
            });

            await inter.reply({ embeds: embeds });

        } catch (error) {
            console.error('❌ Error executing help command:', error);
            if (!inter.replied) {
                await inter.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};
