#ifndef kalman_h
#define kalman_h

// includes
#include <base.h>

// main class
class KalmanFilter {
private:
	TFltVV temp1VV;
	TFltVV temp2VV;
	TFltVV temp3VV;
	TFltVV itemp3VV;
	TFltVV temp4VV;	
	TFltV temp1V;
	TFltV temp2V;
public:
	int CP;						// number of control parameters
	int MP;						// number of measurement parameters
	int DP;						// number of dynamic (model) parameters
	TFltV statePre;				// prior state vector (after prediction and before measurement update)
	TFltV statePost;			// post state vector (after measurement update)
	TFltVV transitionMatrix;	// transition matrix (model)
	TFltVV measurementMatrix;	// measurement matrix
	TFltVV controlMatrix;		// control matrix
	TFltVV processNoiseCov;		// process noise covariance
	TFltVV measurementNoiseCov; // measurement noise covariance
	TFltVV errorCovPre;			// error covariance after prediction
	TFltVV errorCovPost;		// error covariance after update
	TFltVV gain;				// Kalman gain

public:
	KalmanFilter() {};
	KalmanFilter(int dynamParams, int measureParams, int controlParams);
	TFltV Predict(TFltV control);
	TFltV Correct(TFltV measurement);
};

#endif