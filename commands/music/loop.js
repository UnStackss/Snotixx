const { QueueRepeatMode, useQueue } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'loop',
    description: 'Toggle the looping of songs or the whole queue',
    voiceChannel: true,
    options: [
        {
            name: 'action',
            description: 'What action you want to perform on the loop',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Queue', value: 'enable_loop_queue' },
                { name: 'Disable', value: 'disable_loop' },
                { name: 'Song', value: 'enable_loop_song' },
                { name: 'Autoplay', value: 'enable_autoplay' },
            ],
        }
    ],

    async execute({ inter }) {
        await inter.deferReply(); // Differisci la risposta per gestire operazioni lunghe

        const queue = useQueue(inter.guild);
        const errorMessage = await Translate(`Something went wrong <${inter.member}>... try again? <❌>`);
        const baseEmbed = new EmbedBuilder().setColor('#2f3136');

        if (!queue?.isPlaying()) {
            return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again? <❌>`) });
        }

        const action = inter.options.getString('action');
        let resultMessage;

        switch (action) {
            case 'enable_loop_queue': {
                if (queue.repeatMode === QueueRepeatMode.QUEUE) {
                    resultMessage = await Translate(`Queue is already set to loop. Use \`/loop disable\` to turn it off <${inter.member}>... try again? <❌>`);
                } else {
                    queue.setRepeatMode(QueueRepeatMode.QUEUE);
                    resultMessage = await Translate(`Queue repeat mode enabled. The entire queue will be repeated endlessly <🔁>`);
                }
                break;
            }
            case 'disable_loop': {
                if (queue.repeatMode === QueueRepeatMode.OFF) {
                    resultMessage = await Translate(`Loop mode is already disabled <${inter.member}>... try again? <❌>`);
                } else {
                    queue.setRepeatMode(QueueRepeatMode.OFF);
                    resultMessage = await Translate(`Loop mode disabled. The queue will no longer be repeated <🔁>`);
                }
                break;
            }
            case 'enable_loop_song': {
                if (queue.repeatMode === QueueRepeatMode.TRACK) {
                    resultMessage = await Translate(`Current song is already set to loop. Use \`/loop disable\` to turn it off <${inter.member}>... try again? <❌>`);
                } else {
                    queue.setRepeatMode(QueueRepeatMode.TRACK);
                    resultMessage = await Translate(`Current song repeat mode enabled. The current song will be repeated endlessly <🔁>`);
                }
                break;
            }
            case 'enable_autoplay': {
                if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
                    resultMessage = await Translate(`Autoplay is already enabled <${inter.member}>... try again? <❌>`);
                } else {
                    queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                    resultMessage = await Translate(`Autoplay enabled. The queue will be automatically filled with similar songs to the current one <🔁>`);
                }
                break;
            }
            default:
                return inter.editReply({ content: await Translate(`Invalid action <${inter.member}>... try again? <❌>`) });
        }

        baseEmbed.setAuthor({ name: resultMessage });
        return inter.editReply({ embeds: [baseEmbed] });
    }
};
