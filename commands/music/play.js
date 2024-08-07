const { QueryType, useMainPlayer } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

const MY_ID = '1131965612890005626'; // Sostituisci con il tuo ID utente

module.exports = {
    name: 'play',
    description: 'Play a song!',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'The song you want to play',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter, client }) {
        const player = useMainPlayer();
        const song = inter.options.getString('song');
        const channel = inter.member.voice.channel;

        // Assicurati che l'interazione sia deferita se l'operazione richiede tempo
        if (!inter.replied && !inter.deferred) {
            await inter.deferReply();
        }

        // Verifica se l'utente è autorizzato a utilizzare Spotify o SoundCloud
        const isAuthorized = inter.user.id === MY_ID;
        const isSpotifyOrSoundCloud = song.includes('spotify.com') || song.includes('soundcloud.com');

        if (isSpotifyOrSoundCloud && !isAuthorized) {
            const premiumEmbed = new EmbedBuilder()
                .setTitle('🔒 Access Restricted')
                .setDescription('This feature is restricted to specific users. To gain access, consider purchasing **Snotix Premium** for just **2,99€ per month** from our store!')
                .addFields(
                    { name: 'Premium Benefits', value: '• Access to Spotify and SoundCloud links\n• Priority support\n• And more!' },
                    { name: 'Subscribe Now', value: '[Click here to purchase Snotix Premium](https://discord.com/application-directory/1270321783349968978/store)' }
                )
                .setColor('#ff0000')
                .setFooter({
                    text: 'Visit our store for more details',
                    iconURL: 'https://i.imgur.com/F2S7M7R.gif' // Sostituisci con l'URL dell'icona del tuo store
                });

            return inter.editReply({ embeds: [premiumEmbed] });
        }

        try {
            const res = await player.search(song, {
                requestedBy: inter.member,
                searchEngine: QueryType.AUTO
            });

            let defaultEmbed = new EmbedBuilder().setColor('#2f3136');

            if (!res?.tracks.length) {
                defaultEmbed.setAuthor({ name: await Translate('No results found... try again? <❌>') });
                return inter.editReply({ embeds: [defaultEmbed] });
            }

            const { track } = await player.play(channel, song, {
                nodeOptions: {
                    metadata: {
                        channel: inter.channel
                    },
                    volume: client.config.opt.volume,
                    leaveOnEmpty: client.config.opt.leaveOnEmpty,
                    leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
                    leaveOnEnd: client.config.opt.leaveOnEnd,
                    leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
                }
            });

            defaultEmbed.setAuthor({ name: await Translate(`Loading <${track.title}> to the queue... <✅>`) });
            await inter.editReply({ embeds: [defaultEmbed] });

        } catch (error) {
            console.error(`Play error: ${error}`);
            let errorEmbed = new EmbedBuilder().setColor('#FF0000');
            errorEmbed.setAuthor({ name: await Translate(`I can't join the voice channel... try again? <❌>`) });
            if (inter.deferred || inter.replied) {
                await inter.editReply({ embeds: [errorEmbed] });
            } else {
                await inter.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
}
