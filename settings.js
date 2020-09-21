//Manage guild settings for the Elisif bot.

//The evg storage object for guild settings
var evg = new (require('../evg'))("settings");

function getGuildSettings(guildId) {
    return guildId in evg.get() ? evg.get()[guildId] : false;
}

function setGuildSetting(guildId, setting, value) {
    if (getGuildSettings(guildId)) {
        //Guild settings for this guild exist

        var storage = evg.get();

        storage[guildId][setting] = value;

        evg.set(storage);
    }
    else {
        //Guild settings for this guild do not exist

        var storage = evg.get();

        storage[guildId] = getDefaultSettings();
        storage[guildId][setting] = value;

        evg.set(storage);
    }
}

function getGuildSetting(guildId, setting) {
    if (getGuildSettings(guildId)) {
        //Guild settings for this guild exist

        return getGuildSettings()[setting];
    }
    else {
        setGuildSetting(guildId, setting, getDefaultSettings()[setting]);
        return getGuildSettings()[setting];
    }
}

function getDefaultSettings() {

    return {
        prefix: "/",
        music_channels: [],
        command_channels: [],
        custom_commands: [],
        startingBalance: 50,
        battleshipTurns: 25,
        dollarsPerMessage: 1,
        music_disabled: false,
        bot_disabled: false
    }

}

module.exports = {
    get: getGuildSetting,
    getAll: getGuildSettings,
    set: setGuildSetting,
    getDefault: getDefaultSettings
}