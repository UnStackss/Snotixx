const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'jump',
    description: 'Jumps to a particular track in the queue',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'The name or URL of the track you want to jump to',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'number',
            description: 'The position in the queue of the track you want to jump to',
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) {
        await inter.deferReply(); // Differisci la risposta per gestire operazioni lunghe

        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) {
            return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again? <❌>`) });
        }

        const track = inter.options.getString('song');
        const number = inter.options.getNumber('number');
        if (!track && !number) {
            return inter.editReply({ content: await Translate(`You must provide either a track name/URL or a number to jump to <${inter.member}>... try again? <❌>`) });
        }

        let trackName;
        try {
            if (track) {
                const toJump = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track);
                if (!toJump) {
                    return inter.editReply({ content: await Translate(`Could not find the track <${track}> <${inter.member}>... try using the URL or the full name of the song? <❌>`) });
                }

                queue.node.jump(toJump);
                trackName = toJump.title;
            } else if (number) {
                const index = number - 1;
                const toJump = queue.tracks.toArray()[index];
                if (!toJump) {
                    return inter.editReply({ content: await Translate(`The track number <${number}> does not exist <${inter.member}>... try again? <❌>`) });
                }

                queue.node.jump(index);
                trackName = toJump.title;
            }

            const jumpEmbed = new EmbedBuilder()
                .setAuthor({ name: await Translate(`Jumped to <${trackName}> <✅>`) })
                .setColor('#2f3136');

            return inter.editReply({ embeds: [jumpEmbed] });
        } catch (error) {
            console.error(`Jump error: ${error}`);
            return inter.editReply({ content: await Translate(`An error occurred while jumping to the track <${inter.member}>... try again? <❌>`) });
        }
    }
};
