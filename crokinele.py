# -*- coding: utf-8 -*-
"""
Created on Sat Nov 19 16:53:45 2022

@author: Nutzer
"""



from dash import Dash, dash_table
import pandas as pd
from dash import Dash, Input, Output, callback, dcc, html, State

app = Dash(__name__)

app.layout = html.Div(
    [
         html.H1('crokiNele', style = {'text-align': 'center', 'color': 'blue'}),
         #dcc.Store(id='local', data={'df': 'df'}, storage_type='local'),
         html.Label('player number'),
         dcc.RadioItems(
             options = [2,3,4],
             value = 2,
             id = 'number',
             inline=False,
             style = {'width': '40%'}),
         html.Br(),
         html.Label('game mode'),
         dcc.RadioItems(['FREE FOR ALL', 'TEAM-DEATHMATCH'],
                        value = 'FREE FOR ALL',
                        id = 'mode',
                        style = {'width': '60%'}),
         
         html.Br(),
         html.Div(id = 'output_container', children = []),
         html.Br(),
   
         html.Div([
             html.Button(id='submit-button',                
                     children='Submit/Reset'
         )
         ]), 
         
         html.Br(),
         
         html.Div(id="out_tbl"),

     ]
)

@app.callback(
    [Output(component_id = 'output_container', component_property = 'children'),
     Output('out_tbl','children')],
     [Input(component_id='number', component_property='value'),
      Input(component_id='mode', component_property='value'),
      Input('submit-button','n_clicks')],
     [State('submit-button','n_clicks')]
    )

# https://stackoverflow.com/questions/55269763/return-a-pandas-dataframe-as-a-data-table-from-a-callback-with-plotly-dash-for-p

def setup_game(spieler, modus, n_clicks, test):
    container = ['Diese Runde crokiNele wird mit ' + str(spieler) + ' Spieler:innen im Modus ' + str(modus) + ' gespielt!']#["Spieler Anzahl: {}".format(spieler)]
    df = pd.DataFrame(0, index = ['round' + str(round) for round in range(1,spieler+1)], columns= ['player' + str(player) for player in range(1,spieler+1)])
    
    if modus != "FREE FOR ALL" and spieler > 2:
               style=[
                    {
                        'if': {'column_id': df.columns[1]},
                        'backgroundColor': 'rgb(220, 220, 220)'
                    },
                    {
                        'if': {'column_id': df.columns[3]},
                        'backgroundColor': 'rgb(220, 220, 220)'
                    }
             
               ]
    elif modus != "FREE FOR ALL" and spieler < 3:
               style=[
                    {
                        'if': {'column_id': df.columns[1]},
                        'backgroundColor': 'rgb(220, 220, 220)'
                    },
             
               ]
    else: 
            style =[
                {
                    'if': {'row_index': 'odd'},
                    'backgroundColor': 'rgb(220, 220, 220)'
                    }
                ]
    dt = dash_table.DataTable(data = df.to_dict('records'),
                            columns =[{"name": i, "id": i, 'type': 'numeric'} for i in df.columns],
                            
        
           style_data={
              'color': 'black',
              'backgroundColor': 'white'
          },
           style_data_conditional= style,
          
          style_header={
              'backgroundColor': 'rgb(210, 210, 210)',
              'color': 'black',
              'fontWeight': 'bold'
          },
                                    editable = True,
                                    persistence = True,
                                    id = "table")           
    
    if n_clicks:   
         return container, dt
    

if __name__ == '__main__':
    app.run_server(debug=False, port=8052)
