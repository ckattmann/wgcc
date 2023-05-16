<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from './Modal.svelte';
	import NewPeerModal from './NewPeerModal.svelte';
	import PeerDetailsModal from './PeerDetailsModal.svelte';
	import Test from './Test.svelte';
	import { formatDuration, formatBytes } from '../js/format';
	import Plus from 'svelte-material-icons/Plus.svelte';

	let wgconfig = {};
	let showOnlyOnline = false;
	let showPeerDetailsModal = false;
	let showNewPeerModal = false;
	let ifaceForNewPeer: string = '';
	let selectedPeerConfig: string = '';

	function parseIP(ip: string): string {
		if (!ip) return '';
		if (ip.slice(-3) === '/32') return ip.slice(0, -3);
		if (ip.includes(',')) {
			return ip.replaceAll(',', '\n');
		} else return ip;
	}

	function sortPeersFunction(a: Object, b: Object, sortKey: string) {
		sortKey = sortKey || 'allowed_ips';
		if (sortKey === 'allowed_ips') {
			if (
				a[sortKey]
					.split(',')[0]
					.split('/')[0]
					.split('.')
					.map((i) => ('00' + i).slice(-3))
					.join('') >
				b[sortKey]
					.split(',')[0]
					.split('/')[0]
					.split('.')
					.map((i) => ('00' + i).slice(-3))
					.join('')
			)
				return 1;
		}
		if (a[sortKey] > b[sortKey]) return 1;
		else return 0;
	}

	function isOnline(latest_handshake: number): boolean {
		return new Date().getTime() / 1000 - latest_handshake < 120;
	}

	function formatLastContact(latest_handshake: number): string {
		if (latest_handshake == 0) {
			return '-';
		}
		return formatDuration(new Date().getTime() - latest_handshake * 1000);
	}

	async function fetchWGDump() {
		const res = await fetch('http://116.203.199.109:5000/wgdump');
		wgconfig = await res.json();
		return wgconfig;
	}

	onMount(async () => {
		/* const res = await fetch('http://116.203.199.109:5000/wgdump'); */
		/* wgconfig = await res.json(); */
	});
</script>

<input type="checkbox" name="showOnlyOnline" id="showOnlyOnline" bind:checked={showOnlyOnline} />
<span>Only show online peers</span>

{#await fetchWGDump()}
	<div>Loading...</div>
{:then}
	{#each Object.entries(wgconfig) as [iface, peer_configs]}
		<div class="iface-group">
			<div class="iface-title">
				<h1>{iface}</h1>
				<span> Port {peer_configs[0].port} </span>
			</div>
			<div id="table-container">
				<table class="wgconf-table">
					<thead>
						<th class="left" />
						<th class="left">Name</th>
						<th class="left">Allowed IPs</th>
						<th>Endpoint</th>
						<!-- <th>Public Key</th> -->
						<th>Sent</th>
						<th>Received</th>
						<th>Last Contact</th>
					</thead>
					{#each peer_configs.slice(1).sort(sortPeersFunction) as config}
						{#if !showOnlyOnline || isOnline(config.latest_handshake)}
							<tr
								on:click={() => {
									selectedPeerConfig = config;
									showPeerDetailsModal = true;
								}}
							>
								<td class="online-indicator-cell">
									<div class="online-indicator-container">
										{#if isOnline(config.latest_handshake)}
											<svg width="20" height="20">
												<circle cx="10" cy="10" r="5" fill="#17B169" />
											</svg>
										{:else}
											<svg width="20" height="20">
												<circle cx="10" cy="10" r="5" fill="#FF9494" />
											</svg>
										{/if}
									</div>
								</td>
								<td class="left">{config.name || '-'}</td>
								<td class="left allowed-ips mono">{parseIP(config.allowed_ips)}</td>
								<td class="mono">{parseIP(config.endpoint)}</td>
								<!-- <td class="public-key"><pre>{config.public_key}</pre></td> -->
								<td class="mono">{formatBytes(config.transfer_rx)}</td>
								<td class="mono">{formatBytes(config.transfer_tx)}</td>
								<td class="mono">{formatLastContact(config.latest_handshake)}</td>
							</tr>
						{/if}
					{/each}
				</table>
				<button
					class="new-peer-button"
					on:click={() => {
						ifaceForNewPeer = iface;
						showNewPeerModal = true;
					}}
				>
					<Plus />
					<span>New Peer</span>
				</button>
			</div>
		</div>
	{/each}
{:catch}
	<div>Could not connect to API</div>
{/await}

<NewPeerModal bind:showModal={showNewPeerModal} bind:iface={ifaceForNewPeer} />
<PeerDetailsModal bind:showModal={showPeerDetailsModal} bind:peerConfig={selectedPeerConfig} />

<style lang="sass">

$hue: 200

.iface-group
    margin: 3em 0
    // border: 1px solid black


.iface-title
    // margin-top: 3em
    // background-color: hsla($hue, 20%, 90%, 1)
    // color: hsla($hue, 100%, 20%, 1)
    // border-radius: 10px
    border: 1px solid black
    display: flex
    align-items: center
    padding: 5px 10px
    height: 2em
    h1
        font-size: 1.5em
        margin:0
        margin-right: 25px

#table-container
    display: flex
    flex-direction: column
    align-items: center
    padding: 0 5px

    table
        border-collapse: collapse
        width: 100%
        margin-bottom: 5px
        font-family: 'Inter'
        font-weight: 400
        td.right, th.right
            text-align: right
        td.left, th.left
            text-align: left
        thead
            font-weight: 200
            color: black
            border-bottom: 1px solid #CCC
        tr
            border-bottom: 1px solid #CCC
            color: hsla($hue, 100%, 10%, 1)
            &:hover
                cursor: pointer
                background-color: hsla($hue, 20%, 80%, 0.2)

        th
            text-align: right
            // padding: 5px 0
            height: 2em

        td
            text-align: right
            padding: 3px 0
            color: #333
            &.allowed-ips
                max-width: 100px
            &.public-key
                pre
                    max-width: 200px
                    overflow: hidden
                    text-overflow: ellipsis
            .online-indicator-container
                display: flex
                width: 15px


.new-peer-button
    background-color: #fafafa
    padding: 4px 7px
    border-radius: 20px
    display: flex
    align-items: center
    border: none
    font-size: 1em
    font-family: 'Inter'
    border: 1px solid transparent
    > span
        margin-left: 4px
    &:hover
        cursor: pointer
        background-color: #eee
    &:active
        background-color: #ddd
        

</style>
