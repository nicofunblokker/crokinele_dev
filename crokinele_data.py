import pandas as pd
table = pd.read_csv("crokinele_results.csv", header = None, names = ["GameID", "Time", "Round", "Player", "Score", "Twenties"])
