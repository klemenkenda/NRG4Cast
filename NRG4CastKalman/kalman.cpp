#include "kalman.h"

KalmanFilter::KalmanFilter(int dynamParams, int measureParams, int controlParams) {
	// dimensions
	DP = dynamParams;
	MP = measureParams;
	CP = controlParams;

	// check dynamParams & measureParams > 0
	
	// CP should be > 0
	CP = max(CP, 0);

	// XDim in glib means rows, and not cols!!!
	// YDim in glib means cols, not rows!!!

	statePre.Gen(DP, DP);
	statePost.Gen(DP, DP);
	transitionMatrix.Gen(DP, DP);

	processNoiseCov.Gen(DP, DP);
	measurementMatrix.Gen(MP, DP);
	measurementNoiseCov.Gen(MP, MP);

	errorCovPre.Gen(DP, DP);
	errorCovPost.Gen(DP, DP);
	gain.Gen(DP, MP);

	if (CP > 0)
		controlMatrix.Gen(DP, CP);

	temp1VV.Gen(DP, DP);
	temp2VV.Gen(MP, DP);
	temp3VV.Gen(MP, MP);
	itemp3VV.Gen(MP, MP);
	temp4VV.Gen(MP, DP);	
}

TFltV KalmanFilter::Predict(TFltV control) {
	
	// update the state: x'(k) = A * x(k)
	TLinAlg::Multiply(transitionMatrix, statePost, statePre);

	// x'(k) = x'(k) + B * u(k)
	if (!control.Empty()) {
		TLinAlg::Multiply(controlMatrix, control, temp1V);
		TLinAlg::AddVec(1.0, statePre, temp1V, temp2V);
	}

	// update error covariance matrices: temp1 = A * P(k)
	TLinAlg::Multiply(transitionMatrix, errorCovPost, temp1VV);

	// P'(k) = temp1 * At + Q
	TLinAlg::Gemm(1.0, temp1VV, transitionMatrix, 1.0, processNoiseCov, errorCovPre, TLinAlg::GEMM_B_T);
	
	// return statePre
	return statePre;

}

TFltV KalmanFilter::Correct(TFltV measurement) {
	// temp2 = H * P'(k)
	TLinAlg::Multiply(measurementMatrix, errorCovPre, temp2VV);

	// temp3 = temp2 * Ht + R
	TLinAlg::Gemm(1.0, temp2VV, measurementMatrix, 1.0, measurementNoiseCov, temp3VV, TLinAlg::GEMM_B_T);

	// temp4 = inv(temp3) * temp2 = Kt(k)
	TLinAlg::Inverse(temp3VV, itemp3VV, TLinAlg::DECOMP_SVD);
	TLinAlg::Multiply(itemp3VV, temp2VV, temp4VV);

	// K(k)
	TLinAlg::Transpose(temp4VV, gain);

	// temp2V = z(k) - H*x'(k)
	temp1V.Gen(1, 1);
	TLinAlg::Multiply(measurementMatrix, statePre, temp1V);
	temp2V.Gen(measurement.Len(), measurement.Len());
	TLinAlg::AddVec(-1.0, temp1V, measurement, temp2V);

	// x(k) = x'(k) + K(k) * temp2V
	temp1V.Gen(gain.GetRows(), gain.GetRows());
	TLinAlg::Multiply(gain, temp2V, temp1V);
	TLinAlg::AddVec(1.0, statePre, temp1V, statePost);

	// P(k) = P'(k) - K(k) * temp2
	TLinAlg::Gemm(-1.0, gain, temp2VV, 1.0, errorCovPre, errorCovPost, TLinAlg::GEMM_NO_T);

	// return statePost
	return statePost;
}