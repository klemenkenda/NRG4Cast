sc <- read.csv("series.csv", header=F)
#eliminate NA's
sc[is.na(sc)]<-0
# calculate stdev and mean
stdvec <- apply(sc, 1, sd)
meanvec <- apply(sc, 1, mean)
scaledc <- (sc - meanvec)/stdvec
scaledc[is.na(scaledc)]<-0
# calculate distance
distMatrix <- dist(scaledc) #, method="DTW")
# hieararchical clustering
hc <- hclust(distMatrix, method="average")

rect.hclust(hc, k=7, border="red")
plot(hc, main="")