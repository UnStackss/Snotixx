const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'nowplaying',
    description: 'See what song is currently playing!',
    voiceChannel: true,

    async execute({ inter }) {
        try {
            // Defer the reply to ensure we have time to process
            await inter.deferReply();

            const queue = useQueue(inter.guild);

            // Check if the queue is playing
            if (!queue?.isPlaying()) {
                return await inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
            }

            const track = queue.currentTrack;

            // Check if the track exists
            if (!track) {
                return await inter.editReply({ content: await Translate(`Could not fetch track information <${inter.member}>... try again ? <❌>`) });
            }

            // Get track duration and current position
            const duration = track.durationMS || 0; // Duration in milliseconds
            const position = queue.node.position || 0; // Current position in milliseconds

            // Handle special cases for live streams or invalid data
            const trackDuration = duration === Infinity ? 'Live Stream' : `${Math.floor(duration / 60000)}:${Math.floor((duration % 60000) / 1000).toString().padStart(2, '0')}`;

            // Create the progress bar
            const progressBar = queue.node.createProgressBar(); // Use the library method

            // Define loop modes
            const methods = ['Disabled', 'Track', 'Queue'];
            const loopMode = methods[queue.repeatMode] || 'Unknown';

            // Check emoji state
            let EmojiState = client.config.app.enableEmojis;
            const emojis = client.config?.emojis;

            EmojiState = emojis ? EmojiState : false;

            // Create the embed
            const embed = new EmbedBuilder()
                .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
                .setThumbnail(track.thumbnail)
                .setDescription(await Translate(`Volume: **${queue.node.volume}%**\nDuration: **${trackDuration}**\nProgress: ${progressBar}\nLoop mode: **${loopMode}**\nRequested by: ${inter.member.user.username}`))
                .setFooter({ text: await Translate('Music comes first - Made with heart by UnStackss <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) })
                .setColor('#2f3136')
                .setTimestamp();

            // Create action buttons
            const saveButton = new ButtonBuilder()
                .setLabel(EmojiState ? emojis.savetrack : 'Save this track')
                .setCustomId('savetrack')
                .setStyle('Danger');

            const volumeUp = new ButtonBuilder()
                .setLabel(EmojiState ? emojis.volumeUp : 'Volume Up')
                .setCustomId('volumeup')
                .setStyle('Primary');

            const volumeDown = new ButtonBuilder()
                .setLabel(EmojiState ? emojis.volumeDown : 'Volume Down')
                .setCustomId('volumedown')
                .setStyle('Primary');

            const loop = new ButtonBuilder()
                .setLabel(EmojiState ? emojis.loop : 'Loop')
                .setCustomId('loop')
                .setStyle('Danger');

            const resumePause = new ButtonBuilder()
                .setLabel(EmojiState ? emojis.ResumePause : 'Resume / Pause')
                .setCustomId('resume&pause')
                .setStyle('Success');

            const row = new ActionRowBuilder().addComponents(volumeDown, resumePause, volumeUp, loop, saveButton);

            // Reply with the embed and buttons
            await inter.editReply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('Error handling interaction:', error);
            if (!inter.replied) {
                await inter.editReply({ content: 'An error occurred while processing your request. Please try again later. ❌' });
            }
        }
    }
};
