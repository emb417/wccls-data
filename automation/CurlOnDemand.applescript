(*

File: CurlOnDemand.applescript

Abstract: This script demonstrates the AppleScript "Message Received" handler for Messages. It will parse incoming messages to curl local server.

Version: 1.0

*)

using terms from application "Messages"
	
	-- handler to respond to all incoming messages.
	on curlOnDemand(theMessage)
		if (theMessage is "list") or (theMessage is "help") or (theMessage is "news") or (theMessage starts with "add/") or (theMessage starts with "remove/") or (theMessage starts with "due/") or (theMessage starts with "holds/") or (theMessage starts with "status/") or (theMessage starts with "now/") then
			set theResponse to do shell script "curl http://127.0.0.1:1337/" & theMessage
			return theResponse
		end if
		return "The Dude does not abide."
	end curlOnDemand
	
	on message received theMessage from theBuddy for theChat
		set theResponse to curlOnDemand(theMessage)
		send theResponse to theChat
	end message received
	
	on received text invitation theMessage from theBuddy for theChat
		
	end received text invitation
	
	on active chat message received theMessage from theBuddy for theChat
		set theResponse to curlOnDemand(theMessage)
		send theResponse to theChat
	end active chat message received
	
	on addressed chat room message received theMessage from theBuddy for theChat
		
	end addressed chat room message received
	
	on addressed message received theMessage from theBuddy for theChat
		
	end addressed message received
	
	# The following are unused but need to be defined to avoid an error
	
	on received audio invitation theText from theBuddy for theChat
		
	end received audio invitation
	
	on received video invitation theText from theBuddy for theChat
		
	end received video invitation
	
	on received file transfer invitation theFileTransfer
		
	end received file transfer invitation
	
	on buddy authorization requested theRequest
		
	end buddy authorization requested
	
	on message sent theMessage for theChat
		
	end message sent
	
	on chat room message received theMessage from theBuddy for theChat
		
	end chat room message received
	
	on av chat started
		
	end av chat started
	
	on av chat ended
		
	end av chat ended
	
	on login finished for theService
		
	end login finished
	
	on logout finished for theService
		
	end logout finished
	
	on buddy became available theBuddy
		
	end buddy became available
	
	on buddy became unavailable theBuddy
		
	end buddy became unavailable
	
	on completed file transfer
		
	end completed file transfer
	
end using terms from
