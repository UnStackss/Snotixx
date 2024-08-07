const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'search',
    description: 'Search a song',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'The song you want to search',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ client, inter }) {
        await inter.deferReply(); // Defer the reply to ensure the interaction is acknowledged

        const player = useMainPlayer();
        const song = inter.options.getString('song');

        try {
            // Search for the song
            const res = await player.search(song, {
                requestedBy: inter.member,
                searchEngine: QueryType.AUTO
            });

            if (!res || !res.tracks || !res.tracks.length) {
                return await inter.editReply(await Translate(`No results found <${inter.member}>... try again ? <❌>`));
            }

            // Create or get the queue
            const queue = player.nodes.create(inter.guild, {
                metadata: {
                    channel: inter.channel
                },
                spotifyBridge: client.config.opt.spotifyBridge,
                volume: client.config.opt.defaultvolume,
                leaveOnEnd: client.config.opt.leaveOnEnd,
                leaveOnEmpty: client.config.opt.leaveOnEmpty
            });

            // Limit results to 10
            const maxTracks = res.tracks.slice(0, 10);

            // Create the embed message for search results
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({
                    name: await Translate(`Results for "${song}"`),
                    iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
                })
                .setDescription(await Translate(
                    `${maxTracks.map((track, i) => 
                        `**${i + 1}**. 🎵 ${track.title} | ${track.author} ${track.isLive ? '🔴' : '🔊'}`
                    ).join('\n')}\n\n` +
                    `> Select choice between **1** and **${maxTracks.length}** or **cancel** ⬇️`
                ))
                .setTimestamp()
                .setFooter({
                    text: await Translate('Music comes first - Made with heart by UnStackss <❤️>'),
                    iconURL: inter.member.displayAvatarURL({ dynamic: true })
                });

            // Send the initial embed message and store its ID
            const reply = await inter.editReply({ embeds: [embed] });

            // Message collector for user input
            const collector = inter.channel.createMessageCollector({
                time: 15000,
                max: 1,
                errors: ['time'],
                filter: m => m.author.id === inter.member.id
            });

            collector.on('collect', async (msg) => {
                collector.stop();
                if (msg.content.toLowerCase() === 'cancel') {
                    await reply.delete(); // Delete the original search results message
                    return await inter.followUp({ content: await Translate(`Search cancelled <✅>`), ephemeral: true });
                }

                const value = parseInt(msg.content);
                if (isNaN(value) || value <= 0 || value > maxTracks.length) {
                    await reply.delete(); // Delete the original search results message
                    return await inter.followUp({
                        content: await Translate(`Invalid response, try a value between **1** and **${maxTracks.length}** or **cancel**... try again ? <❌>`),
                        ephemeral: true
                    });
                }

                try {
                    if (!queue.connection) await queue.connect(inter.member.voice.channel);
                } catch {
                    await player.deleteQueue(inter.guildId);
                    await reply.delete(); // Delete the original search results message
                    return await inter.followUp({
                        content: await Translate(`I can't join the voice channel <${inter.member}>... try again ? <❌>`),
                        ephemeral: true
                    });
                }

                // Add the track and update the embed
                const trackToAdd = res.tracks[value - 1];
                queue.addTrack(trackToAdd);

                if (!queue.isPlaying()) await queue.node.play();

                // Update the embed to confirm the track was added
                const confirmationEmbed = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({
                        name: await Translate(`Track Added: "${trackToAdd.title}"`),
                        iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
                    })
                    .setDescription(await Translate(
                        `The song **${trackToAdd.title}** by **${trackToAdd.author}** has been added to the queue.\n` +
                        `Duration: **${trackToAdd.duration}**\n` +
                        `Song URL: [Click here](${trackToAdd.url})\n\n` +
                        `From the server Snotix 🎧`
                    ))
                    .setTimestamp()
                    .setFooter({
                        text: await Translate('Enjoy your music!'),
                        iconURL: inter.member.displayAvatarURL({ dynamic: true })
                    });

                await reply.delete(); // Delete the original search results message
                await inter.followUp({ embeds: [confirmationEmbed] });
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    await reply.delete(); // Delete the original search results message
                    await inter.followUp({ content: await Translate(`Search timed out <${inter.member}>... try again ? <❌>`), ephemeral: true });
                }
            });

        } catch (error) {
            console.error('Error while searching for a song:', error);
            await inter.editReply({ content: await Translate(`An error occurred while searching for the song <${inter.member}>... try again ? <❌>`) });
        }
    }
};
