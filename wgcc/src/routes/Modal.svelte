<script lang="ts">
	import { onMount } from 'svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	let dialog: HTMLDialogElement;
	$: if (dialog && showModal) dialog.showModal();

	export let showModal: boolean;
	$: if (!showModal) {
        // console.log(showModal, dialog)
        onMount(() => {
            document?.querySelector('#dialog')?.close();
        })
    }

</script>

<template lang="pug">
<!-- svelte-ignore a11y-click-events-have-key-events -->
dialog#dialog(
    bind:this="{dialog}"
    on:close!="{() => (showModal = false)}"
    on:click|self!="{() => dialog.close()}"
)
    Close(on:click!="{() => dialog.close()}")
    div(on:click|stopPropagation)
        slot
    

</template>

<style lang="sass">

#dialog
    border: none
    padding: 0
    > div
        padding: 1em
//- button
//- 	display: block
dialog::backdrop
    background: rgba(0, 0, 0, 0.7)

</style>
