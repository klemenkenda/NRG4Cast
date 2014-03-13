// -----------------------------------------------------------------------
// FILE: KalmanFilter.cpp
// AUTHOR: Klemen Kenda
// DESCRIPTION: Perform off-line Kalman filter analysis for data cleaning
//   for NRG4Cast Data Cleaning module.
// -----------------------------------------------------------------------

#include <stdio.h>
#include <base.h>
#include "kalman.h"

// -----------------------------------------------------------------------
// FUNCTION: ParseQMinerTmStr
// DESCRIPTION: Parse QMiner style timestamp string
// -----------------------------------------------------------------------

TTm ParseQMinerTmStr(const TStr& TmStr) {
	// 2011-01-15T12:12
	TTm Tm;
	TStr LStr; TStr RStr; // left & right string
	TStrV DateStrV, HourStrV; // string vectors for date and hour
	TInt Year = 0, Month = 0, Day = 0, Hour = 0, Minute = 0, Second = 0;

	if (TmStr.IsChIn('T')) {
		// splitting to the left (date) and right (time) part of timestring
		TmStr.SplitOnCh(LStr, 'T', RStr);
		// left
		if (LStr.IsChIn('-')) {
			// validate date
			LStr.SplitOnAllCh('-', DateStrV);
			if (DateStrV.Len() == 3) {
				if (DateStrV[2].IsInt()) { Day = DateStrV[2].GetInt(); }
				if (DateStrV[1].IsInt()) { Month = DateStrV[1].GetInt(); }
				if (DateStrV[0].IsInt()) { Year = DateStrV[0].GetInt(); }		
			}
		}
		// right
		if (RStr.IsChIn(':')) {
			RStr.SplitOnAllCh(':', HourStrV);
			if (HourStrV.Len() >= 2){
				if (HourStrV[0].IsInt()) {Hour = HourStrV[0].GetInt();}
				if (HourStrV[1].IsInt()) {Minute = HourStrV[1].GetInt();}				
				Second = 0;
			}	else if (HourStrV.Len() >= 3) {
				if (HourStrV[2].IsInt()) {Second = HourStrV[2].GetInt();}
			}
		}
		Tm = TTm(Year, Month, Day, -1, Hour, Minute, Second, 0);
	}

	return Tm;
}

// -----------------------------------------------------------------------
// definition of the filter
// -----------------------------------------------------------------------

#define _DP 3
#define _MP 1
#define _CP 0


// -----------------------------------------------------------------------
// FUNCTION: main
// DESCRIPTION: Main part of the program
// -----------------------------------------------------------------------

int main(int argc, char* argv[]){		
	// variable initialization
	TFltV controlV;
	TFltV predictedV;
	TFltV measurementV;
	TFltV correctedV;
	TFlt gap;
	
	TStr InFNm, OutFNm, ParametersFNm;
	TStr LnStr, OutLnStr;
	TStr ValStr, TimeStr;

	// filter prediction boundaries
	TFlt PMin;
	TFlt PMax;
	// original measurement in case an outlier is detected
	TFlt OrigMeasurement;

	// define KF & init matrixes
	KalmanFilter KF = KalmanFilter(_DP, _MP, _CP);
	TLAMisc::FillIdentity(KF.transitionMatrix);		// DPxDP		
	KF.measurementMatrix(0, 0) = 1;

	// initialize filter parameters form file parameters.txt	
	ParametersFNm = "parameters.txt";
	TFIn ParFIn(ParametersFNm);
	ParFIn.GetNextLn(LnStr); KF.processNoiseCov(0, 0) = LnStr.GetFlt();
	ParFIn.GetNextLn(LnStr); KF.processNoiseCov(1, 1) = LnStr.GetFlt();
	ParFIn.GetNextLn(LnStr); KF.processNoiseCov(2, 2) = LnStr.GetFlt();

	ParFIn.GetNextLn(LnStr); KF.measurementNoiseCov(0, 0) = LnStr.GetFlt();

	ParFIn.GetNextLn(LnStr); KF.errorCovPost(0, 0) = LnStr.GetFlt();
	ParFIn.GetNextLn(LnStr); KF.errorCovPost(1, 1) = LnStr.GetFlt();
	ParFIn.GetNextLn(LnStr); KF.errorCovPost(2, 2) = LnStr.GetFlt();

	ParFIn.GetNextLn(LnStr); gap = LnStr.GetFlt();


	
	/*
	// old test initialization
	TLAMisc::FillIdentity(KF.processNoiseCov, 0.0000001); // DPxDP
	TLAMisc::FillIdentity(KF.measurementNoiseCov, 0.3); // MPxMP
	TLAMisc::FillIdentity(KF.errorCovPost, 0.1); // DPxDP
	*/

	// init measurement vector
	measurementV.Add(1.1, _MP);
	
	InFNm = "sample.csv";
	OutFNm = "output.csv";

	TFIn LogFIn(InFNm);
	TFOut LogFOut(OutFNm);

	// file reading metadata
	TInt TimestampN = 0;
	TInt ValueN = 1;
	const char Delimiter = ';';

	TStrV TokenV;

	// read first N lines - for initialization/skipping headers
	TInt N = 1;
	for (int i = 0; i < N; i++)	LogFIn.GetNextLn(LnStr);

	// tokenize string
	LnStr.ChangeStrAll("\"", "");
	LnStr.SplitOnAllCh(Delimiter, TokenV);

	// 1-dim model
	KF.statePost[0] = TokenV[ValueN].GetFlt();	
	// 2-dim model
	KF.statePost[1] = 0;
	// 3-d model
	KF.statePost[2] = 0;

	// get timestamp
	TTm LastTm = ParseQMinerTmStr(TokenV[TimestampN]);
	TTm NewTm;
	TFlt DeltaT;
	
	int lines = 0;

	while (LogFIn.GetNextLn(LnStr)) {
		lines++;

		// tokenize string
		LnStr.ChangeStrAll("\"", "");
		LnStr.SplitOnAllCh(Delimiter, TokenV);
		// extract time
		NewTm = ParseQMinerTmStr(TokenV[TimestampN]);
		// get delta t
		DeltaT = TTm::GetDiffMins(NewTm, LastTm);
		LastTm = NewTm;

		// create transitional matrix (A)
		// 1-d
		KF.transitionMatrix(0, 0) = 1;
		// 2-d
		KF.transitionMatrix(0, 1) = DeltaT;		
		KF.transitionMatrix(1, 0) = 0;
		KF.transitionMatrix(1, 1) = 1;		
		// 3-d
		KF.transitionMatrix(0, 2) = 1./2 * DeltaT * DeltaT;
		KF.transitionMatrix(1, 2) = DeltaT;
		KF.transitionMatrix(2, 0) = 0;
		KF.transitionMatrix(2, 1) = 0;
		KF.transitionMatrix(2, 2) = 1;

		// 1-d model
		measurementV[0] = TokenV[ValueN].GetFlt();

		// KalmanFilter - prediction phase
		predictedV = KF.Predict(controlV);

		// data cleaning part
		PMin = predictedV[0] - gap * KF.errorCovPre.At(0, 0);
		PMax = predictedV[0] + gap * KF.errorCovPre.At(0, 0);

		bool outlier = false;

		OrigMeasurement = measurementV[0];

		if (((measurementV[0] > PMax) || (measurementV[0] < PMin))) {			
			printf("Outlier: %.2f, min: %.2f, max: %.2f\n", measurementV[0], predictedV[0], PMin, PMax);
			measurementV[0] = predictedV[0];
			outlier = true;
		}
		
		
		// KalmanFilter correction phase
		correctedV = KF.Correct(measurementV);

		// increase variance if there was an outlier detected
		if (outlier) KF.errorCovPost(0, 0) = KF.errorCovPost(0, 0) * 15.0;
		
		printf("DT: %.2f\tM:%.2f \tP: %.2f\tC: %.2f\tC: %.2f\n", DeltaT, measurementV[0], predictedV[0], correctedV[0], KF.errorCovPost(0, 0));
		OutLnStr = TokenV[TimestampN] + ";" + OrigMeasurement.GetStr() + ";" + PMin.GetStr() + ";" + PMax.GetStr() + ";";
		LogFOut.PutStrLn(OutLnStr);
	}
	
	return 0;		
}