(*

File: CurlOnDemand.applescript

Abstract: This script demonstrates the AppleScript "Message Received" handler for Messages. It will parse incoming messages to curl local server.

Version: 1.0

*)

using terms from application "Messages"
	
	on encodeMessage(theMessage)
		set encodedMessage to theMessage
		set encodedMessage to do shell script "echo " & quoted form of encodedMessage & " | sed -e 's/ /\\//'"
		if (encodedMessage starts with "due/") or (encodedMessage starts with "holds/") or (encodedMessage starts with "now/") then
			set encodedMessage to do shell script "echo " & quoted form of encodedMessage & " | sed -e 's/ /\\//'"
		end if
		set encodedMessage to do shell script "echo " & quoted form of encodedMessage & " | sed -e 's/ /+/g'"
		return encodedMessage
	end encodeMessage
	
	on curlOnDemand(theMessage)
		if (theMessage starts with "what games") or (theMessage starts with "what ps4") then
			set theMessage to "now/39/ps4"
		end if
		if (theMessage starts with "what am i") or (theMessage starts with "whats on") then
			set theMessage to "list"
		end if
		if (theMessage starts with "when") or (theMessage starts with "whats due") then
			set theMessage to "due/1234567890/1234"
		end if
		if (theMessage starts with "whats requested") or (theMessage starts with "what are") then
			set theMessage to "holds/1234567890/1234"
		end if
		if (theMessage starts with "whats up") then
			set theMessage to "news"
		end if
		if (theMessage starts with "where is") then
			set theMessage to do shell script "echo " & quoted form of theMessage & " | sed -e 's/[wW]here is/find/'"
		end if
		set thePath to encodeMessage(theMessage)
		if (thePath is "branches") or (thePath starts with "hours") or (thePath is "list") or (thePath is "help") or (thePath is "news") or (thePath starts with "add/") or (thePath starts with "remove/") or (thePath starts with "due/") or (thePath starts with "holds/") or (thePath starts with "find/") or (thePath starts with "status/") or (thePath starts with "now/") then
			set theResponse to do shell script "curl http://127.0.0.1:1337/" & thePath
			if (theResponse is "{}") then
				return "This aggression will not stand, man."
			end if
			return theResponse
		end if
		if (theMessage starts with "where am i") then
			return "Yeah, well, I'm outta here."
		end if
		return "Yeah, well, that's just, like, your opinion, man."
	end curlOnDemand
	
	on message received theMessage from theBuddy for theChat
		set theResponse to curlOnDemand(theMessage)
		send theResponse to theChat
	end message received
	
	on active chat message received theMessage from theBuddy for theChat
		set theResponse to curlOnDemand(theMessage)
		send theResponse to theChat
	end active chat message received
	
	on received text invitation theMessage from theBuddy for theChat
		
	end received text invitation
	
	on addressed chat room message received theMessage from theBuddy for theChat
		
	end addressed chat room message received
	
	on addressed message received theMessage from theBuddy for theChat
		
	end addressed message received
	
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
