import React from "react";
import {
  useMediaQuery,
  TextField,
  Autocomplete,
  Typography,
} from "@mui/material";

export default function SelectCartoes( {cartaoSelecionado, cartoes, setCartaoSelecionado, title} ) {
  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta telas pequenas
  
  // console.log(cartoes);
  // console.log(cartaoSelecionado);

  return (
    <>
      <Autocomplete
        disablePortal
        options={cartoes}
        value={cartaoSelecionado}
        onChange={(event, newValue) => {
          setCartaoSelecionado(newValue);
        }}
        sx={{
          width: isMobile ? "100%" : 320,
          margin: "10px 0",
          backgroundColor: "#FFFFFF",
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={title}
            multiline
            InputProps={{
              ...params.InputProps,
              style: {
                whiteSpace: "pre-line",
                maxHeight: "55px",
              },
            }}
          />
        )}
        getOptionLabel={(option) =>
          cartaoSelecionado ? `${option?.label}\n${option?.num_cartao}` : ""
        }
        renderOption={(props, option) => (
          <li {...props}>
            <div>
              <Typography
                variant="body1"
                noWrap
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {option?.label}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                noWrap
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {option?.num_cartao}
              </Typography>
            </div>
          </li>
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Typography
              variant="body2"
              key={index}
              {...getTagProps({ index })}
              noWrap
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {`${option?.label}\n${option?.num_cartao}`}
            </Typography>
          ))
        }
      />
    </>
  );
}
