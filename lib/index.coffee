node = require './node'
parambulator = require 'parambulator'

base_options =
	type: 'tcp'
	election_timeout: 2000
	heartbeat_period: 2000
	heartbeat_timeout: 6000
	multicast_addr: '239.1.2.3'
	multicast_port: 45555
	pgm_addr: '239.1.2.4'
	pgm_port: 45555

exports.createNode = (options = {}) ->
	throw new Error 'options must be an object' if typeof options isnt 'object'

	# set options with base_options if not found
	for key, value of base_options
		options[key] = value if not options.hasOwnProperty key

	if options.type not in ['tcp', 'pgm', 'epgm']
		throw new Error 'type must be tcp, pgm or epgm'

	isNumber = (n) ->
		!isNaN(parseFloat(n)) && isFinite(n)

	# check for numbers
	for a in ['election_timeout', 'heartbeat_period', 'heartbeat_timeout', 'multicast_port', 'pgm_port']
		if not isNumber options[a]
			throw new Error "#{a} must be a number"

	if options.type == 'tcp'
		node = new node.ElectedNode(options)
	else
		node = new node.PgmNode(options)
	return node