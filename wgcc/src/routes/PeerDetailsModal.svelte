<script lang="ts">
	import Modal from './Modal.svelte';

	export let showModal: boolean;
	export let peerConfig;
	$: console.log(peerConfig);

	let name: string = 'name';
	let allowed_ips: string = '10.20.0.5';

	async function setPeerName() {
		const res = await fetch(
			'http://116.203.199.109:5000/setpeername?' +
				new URLSearchParams({ name: peerConfig.name, public_key: peerConfig.public_key }),
			{
				method: 'POST'
			}
		).then((response) => {});
	}
</script>

<template lang="pug">

Modal(bind:showModal="{showModal}")
    h3#modal-title Peer Details
    div#newPeerWindow
        div
            span Name (optional)
            input( type="text", id="name",
                bind:value="{peerConfig.name}",
                on:change!="{() => { console.log(peerConfig.name); setPeerName(peerConfig.name) }}"
            )
        div
            span Allowed IPs
            input(type="text" id="allowed_ips" bind:value="{peerConfig.allowed_ips}")
        div
            span Public Key
            input(type="text" bind:value="{peerConfig.public_key}" disabled)
        div
            span Persistent Keepalive / seconds
            input(type="text" id="Persistent Keepalive" bind:value="{peerConfig.persistent_keepalive}")

    button#new-peer-button(on:click!="{() => {  }}") Update Information
    //- button(on:click!="{() => { showModal=false }}") Cancel


</template>

<style lang="sass">

#modal-title
    margin-top: 0
#newPeerWindow
    display: flex
    flex-direction: column
    width: 400px
    > div
        display: flex
        flex-direction: column
        margin: 8px 0
        > span
            color: gray
            font-size: 0.9em
        input
            height: 30px
            font-family: 'Inter'
            font-size: 1em
            padding: 1px 5px
            background-color: whitesmoke
            border: none
            box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.1) inset
        input:focus
            outline: none
            //- box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.2) inset
            //- border: 2px solid black

#new-peer-button
    margin-top: 1em
    width: 100%
    height: 36px
    font-size: 1.0em
    //- background-color: hsl(200,50%,80%)
    //- background-color: midnightblue
    border: 1px solid black
    //- color: white
    //- border: none
    margin-left: auto
    &:hover
        //- background-color: hsl(200,50%,60%)
        cursor: pointer
        box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2)
    &:active
        box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2) inset

        

</style>
