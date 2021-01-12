import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [code, setCode] = useState('')
  const [idR, setIdR] = useState('')
  const [msg, setMsg] = useState('')


  const handleIdr = (id) => {
    setIdR(id)
  }
  
  const handleCode = (cod) => {
    setCode(cod)
  }

  const verifyCode = async() => {
    try {
        setMsg('')
        const res = await axios.get('http://localhost:3001/validate/purchase', {
            params: {
              code,
              id: idR
            }
          })
        console.log("res verification code: ", res)
        setCode('')
        setIdR('')
        if (res.status === 200) {
            setMsg('Verificación exitosa')
        }
    } catch (e) {
        setCode('')
        setIdR('')
        if (e.response.status === 400) {
            setMsg('Credenciales incorrectas, intente de nuevo por favor')
        }
        if (e.response.status === 500) {
            setMsg('Error, por favor intente más tarde')
        }
        console.log("Error retrieving verification code: ", e.response)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
            Verifica código de compra
        </Typography>
        <form className={classes.form} noValidate>
          <label>ID repartidor</label>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={idR}
            onChange={(e) => handleIdr(e.target.value)}
          />
          <label>Código de compra</label>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            type="password"
            value={code}
            onChange={(e) => handleCode(e.target.value)}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            fullWidth
            variant="contained"
            style={{
                borderRadius: 15,
                backgroundColor: "#b0b435",
                padding: "10px 26px",
                fontSize: "18px"
            }}
            onClick={() => verifyCode()}
            disabled={idR === '' && code === ''}
          >
            Verificar
          </Button>
          {
              msg === "Verificación exitosa"
              ? <label style={{ color: "rgb(176, 180, 53)", fontWeight: "bold" }}>{msg}</label>
              : <label style={{ color: "red", fontWeight: "bold" }}>{msg}</label>
          }
          
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </div>
      {/* <Box mt={8}>
        <Copyright />
      </Box> */}
    </Container>
  );
}