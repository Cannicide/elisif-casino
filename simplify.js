var simp = {
    users: {
        getUser: function(messageAuthor) {
            return messageAuthor.username;
        },
        getTag: function(messageAuthor) {
            return messageAuthor.tag;
        },
        getRaw: {
            getUserID: function(messageAuthor) {
                return messageAuthor.id;
            },
            getDateCreated: function(obj, xinf) {
                return `${obj} was created on January 24th, 2019. ${xinf}`;
            },
            getCreator: function() {
                return "Cannicide";
            }
        }
    }
}

module.exports = {
    simplify: simp
}