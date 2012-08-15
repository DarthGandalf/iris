/* Create the client UI. */
qwebirc.ui.create = function(element, uiclass) {

  /* Initialise our Atheme login and single session. */
	sessions = {};
	sessions[""] = new qwebirc.session();
	sessions[""].network = "(not-network)";
	sessions["(not-network)"] = sessions[""];

  /* Now wait until all the JS is loaded. */
  window.addEvent("domready", function() {

    /* Define login function. */
    var callback = function(connOptions) {
		var session = sessions[connOptions.network] = new qwebirc.session();
		session.network = connOptions.network;
      session.irc = new qwebirc.irc.IRCClient(session, connOptions);
      session.irc.connect();
      window.onbeforeunload = qwebirc.ui.onbeforeunload;
      window.addEvent("unload", function() {
        session.irc.quit("Web client closed");
      });
    };

    /* Create UI. */
    ui = new uiclass(sessions, $(element));

	ZNC_Networks.each(function(net) {
		callback({
			nickname : "znc-webuser",
			network : net,
			autojoin : ""
		});
	});

    /* Create login window. */ 
    /*ui.connectWindow(callback);*/

    /* If enabled, open channel list. */
    if (conf.atheme.chan_list_on_start) {
      if (qwebirc.ui.Panes.List)
        ui.addPane("List");
    } 
  });
};


/* Displays a warning if the user tries to close their browser. */
qwebirc.ui.onbeforeunload = function(e) { /* IE sucks */
  if (qwebirc.connected) {
    var message = "This action will close all active IRC connections.";
    var e = e || window.event;
    if(e)
      e.returnValue = message;
    return message;
  }
};
