<script>
	import logo from '../assets/logo.svg';
</script>

<head>
    <title>WGCC</title>
</head>
<nav>
	<div id="navbar">
		<img id="logo" src={logo} alt="wgcc project logo" />
	</div>
</nav>

<div id="content">
	<slot />
</div>

<style>
	@font-face {
		font-family: 'Inter';
		font-style: normal;
		src: url('/fonts/Inter.woff2');
	}

	@font-face {
		font-family: 'RobotoMono';
		font-style: normal;
		font-weight: 400;
		src: url('/fonts/RobotoMono.ttf');
	}

	@font-face {
		font-family: 'Oswald';
		font-style: normal;
		src: url('/fonts/Oswald.ttf');
	}


	/* :global(.mono) {
		font-family: RobotoMono;
		font-size: 1em;
		font-weight: 450;
	} */

	:global(body) {
		margin: 0;
		font-family: 'Inter', sans-serif;
	}

	#content {
		padding: 20px;
	}

	#navbar {
		background-color: #fefefe;
		/* box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.2); */
		border-bottom: 1px solid whitesmoke;
		display: flex;
	}
	#logo {
		width: 100px;
	}
</style>
