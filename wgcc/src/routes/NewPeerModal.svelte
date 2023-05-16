<script lang="ts">
	import Modal from './Modal.svelte';

	export let showModal:boolean;
	export let iface: string;

	let name: string = 'name'
	let allowed_ips: string = '10.20.0.5'
	let persistent_keepalive: number = 25

	async function createPeer() {
		const res = await fetch('http://116.203.199.109:5000/createpeer', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ interface: iface, name:name, allowed_ips: allowed_ips })
		});
		console.log(res);
	}
</script>

<template lang="pug">

Modal(bind:showModal="{showModal}")
    h3#modal-title Create New Peer
    div#newPeerWindow
        div
            span Name (optional): 
            input(type="text" id="name", bind:value="{name}")
        div
            span Allowed IPs: 
            input(type="text" id="allowed_ips" bind:value="{allowed_ips}")
        //- div
        //-     span DNS:
        //-     input(type="text" id="dns")
        div
            span Persistent Keepalive:
            input(type="text" id="Persistent Keepalive" bind:value="{persistent_keepalive}")

    button#new-peer-button(on:click!="{createPeer}") Create new peer
    //- button(on:click!="{() => { showModal=false }}") Cancel


</template>

<style lang="sass">

#modal-title
    margin-top: 0
#newPeerWindow
    display: flex
    flex-direction: column
    > div
        display: flex
        flex-direction: column
        margin-bottom: 5px
        > span
            color: gray
            font-size: 0.9em
        input
            height: 24px
            font-family: 'Inter'
            font-size: 1em
            padding: 2px 2px
            background-color: whitesmoke
            border: none
        input:focus
            outline: none
            //- box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.2) inset
            //- border: 2px solid black

#new-peer-button
    height: 30px
    background-color: hsl(200,50%,80%)
    border: none
    margin-left: auto
    &:hover
        background-color: hsl(200,50%,60%)
        cursor: pointer
        box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2)
    &:active
        box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2) inset

        

</style>
