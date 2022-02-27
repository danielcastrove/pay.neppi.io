


export function GetParametrosSelectBanco() {
    return new Promise((resolve, reject) => {
      let quote;
      try {
        setTimeout(function() {
          quote = [
              { id: "1245", Pais: "Venezuela", Bancos: [ { id:"458452147754", name: "Banco plaza", productos: [1,2,3], imagenlogo:"https://1000marcas.net/wp-content/uploads/2020/07/Logo-ICBC.png" },
              { id:"458452147765", name: "Api pago", productos: [1,2,3], imagenlogo:"https://1000marcas.net/wp-content/uploads/2020/07/Logo-ICBC.png" },
              { id:"458452147732", name: "Banco del pueble", productos: [1,2,3], imagenlogo:"https://1000marcas.net/wp-content/uploads/2020/07/Logo-ICBC.png" } ]},
              { id: "12452", Pais: "Canada", Bancos: [ { id:"458452147234", name: "Banco plaza Canada", productos: [1,2,3], imagenlogo:"https://1000marcas.net/wp-content/uploads/2020/07/Logo-ICBC.png" },
              { id:"458452147776", name: "ICBC", productos: [1,2,3], imagenlogo:"https://1000marcas.net/wp-content/uploads/2020/07/Logo-ICBC.png" },
              { id:"458452147723", name: "Canadian agenci", productos: [1,2,3], imagenlogo:"https://1000marcas.net/wp-content/uploads/2020/07/Logo-ICBC.png" } ]}
          ]
          resolve(quote);
        }, 2000);
      } catch (error) {
        reject('nu ma no se pudo cargar :\'v');
      }
  
    });
  }