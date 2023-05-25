table <- read.csv(
  file = "crokinele_results.csv",
  check.names = F, 
  header = F,
  col.names = c("Round", "Player", "Score", "Twenties")
)