import { ApplyOptions } from "@sapphire/decorators";
import { Command, } from "@sapphire/framework";
import { ApplicationCommandType, User } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "user-info",
    description: "Get information about a user",
    aliases: ["uinfo"],
    preconditions: ["GuildOnly"]
})

class UserInfo extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption((option) => option.setName("user").setDescription("The user to get information about"))
        })

        registry.registerContextMenuCommand({
            name: this.name,
            type: ApplicationCommandType.Message
        });

        registry.registerContextMenuCommand({
            name: this.name,
            type: ApplicationCommandType.User
        });
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true);
        if (!user) {
            return interaction.reply({ content: "User not found" });
        }

        const info = await this._whois(user);
        return interaction.reply({ content: info });
    }

    private async _whois(user: User) {
        return `User: ${user.tag} (${user.id})\nCreated at: ${user.createdAt}\nIs a bot: ${user.bot ? "Yes" : "No"}`
    }
}