const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

// Function to convert time string to milliseconds
function parseTime(timeStr) {
    const match = timeStr.match(/^(\d+)([smh]?)$/);
    if (!match) return null;
    
    const value = parseInt(match[1], 10);
    const unit = match[2];
    
    switch (unit) {
        case 'h':
            return value * 60 * 60 * 1000; // hours to milliseconds
        case 'm':
            return value * 60 * 1000; // minutes to milliseconds
        case 's':
        default:
            return value * 1000; // seconds to milliseconds
    }
}

module.exports = {
    name: 'seek',
    description: 'Seek to a specific time in the current song',
    voiceChannel: true,
    options: [
        {
            name: 'time',
            description: 'The time to seek to (e.g., 1s, 2m, 3h)',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ client, inter }) {
        await inter.deferReply(); // Defer the reply to ensure the interaction is acknowledged

        const queue = useQueue(inter.guild);
        const timeStr = inter.options.getString('time');
        const timeInMs = parseTime(timeStr);

        if (!queue || !queue.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }

        if (timeInMs === null || timeInMs < 0 || timeInMs > queue.currentTrack.duration) {
            return await inter.editReply({ content: await Translate(`Invalid time value <${inter.member}>... try again ? <❌>`) });
        }

        try {
            // Seek to the specified time
            queue.node.seek(timeInMs);

            // Create and send the success embed
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({
                    name: await Translate('Seek Successful'),
                    iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
                })
                .setDescription(await Translate(`Jumped to **${Math.floor(timeInMs / 60000)}:${Math.floor((timeInMs % 60000) / 1000)}** in the current song <✅>`))
                .setTimestamp()
                .setFooter({
                    text: await Translate('Enjoy your music!'),
                    iconURL: inter.member.displayAvatarURL({ dynamic: true })
                });

            await inter.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error while seeking:', error);
            // If the interaction has not been replied to yet, send an error message
            if (!inter.replied) {
                await inter.editReply({ content: await Translate(`An error occurred while seeking <${inter.member}>... try again ? <❌>`) });
            }
        }
    }
};
