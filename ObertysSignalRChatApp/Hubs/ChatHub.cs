using Microsoft.AspNetCore.SignalR;
using System.Globalization;

namespace ObertysSignalRChatApp.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user , string message)
        {
            await  Clients.All.SendAsync("ReceiveMessage" ,user, message);
        }
    }
}
