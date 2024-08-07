module.exports = {
    app: {
        token: "MTI3MDMyMTc4MzM0OTk2ODk3OA.GBGzY-.h9xDsk2gmQWzD0B3l1ePa3a0sc8haoTV0hNP8A",
        playing: "Do /help",
        global: true,
        guild: "1270312699397668886", 
        extraMessages: false,
        loopMessage: false,
        lang: "en",
        enableEmojis: false,
    },

    emojis: {
        back: "⏪",
        skip: "⏩",
        ResumePause: "⏯️",
        savetrack: "💾",
        volumeUp: "🔊",
        volumeDown: "🔉",
        loop: "🔁",
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: "",
            commands: [],
        },
        Translate_Timeout: 10000,
        maxVol: 100,
        spotifyBridge: true,
        volume: 50,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 30000,
        discordPlayer: {
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25,
            },
        },
    },
};
