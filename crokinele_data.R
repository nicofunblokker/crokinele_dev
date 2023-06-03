table <- read.csv(
  file = "crokinele_results.csv",
  check.names = F, 
  header = F,
  col.names = c("GameID", "Time", "Round", "Player", "Score", "Twenties")
)