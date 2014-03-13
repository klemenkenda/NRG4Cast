#include <stdio.h>
#include <conio.h>
#include <base.h>
#include "kalman.h"
#include "gnuplot/gnuplot_i.cpp"
#include "include/gnui.h"
#include <random>

// define class for obs A * Sin[lambda * x]
class EKFSine : public ExtendedKalmanFilter {
public:
	TFltV parameterV;
	TFltV observationEq() {
		TFltV observationV;
		TFlt o;
		o = statePost[0] * sin(statePost[1] * parameterV[0]);
		observationV.Add(o);
		return observationV;
	}
	TFltV transitionEq() {
		TFltV transitionV;
		transitionV.Add(statePost[0]);
		transitionV.Add(statePost[1]);			
		return transitionV;
	}

	EKFSine(int DP, int MP, int CP) : ExtendedKalmanFilter(DP, MP, CP) {
		// we only need one additional paramter here
		parameterV.Gen(1, 1);
	}
};


// define class for obs A * Sin[lambda * x]
class EKFKidney2C : public ExtendedKalmanFilter {
public:
	TFltV parameterV;
	TFltV observationEq() {
		TFltV observationV;
		TFlt o;
		o = statePost[0] * exp(statePost[1] * parameterV[0]) +
			statePost[2] * exp(statePost[3] * parameterV[0]) +
			statePost[4];
		observationV.Add(o);
		return observationV;
	}
	TFltV predictionEq() {
		TFltV observationV;
		TFlt o;
		o = statePre[0] * exp(statePre[1] * parameterV[0]) +
			statePre[2] * exp(statePre[3] * parameterV[0]) +
			statePre[4];
		observationV.Add(o);
		return observationV;
	}

	TFltV transitionEq() {
		TFltV transitionV;
		transitionV.Add(statePost[0]);
		transitionV.Add(statePost[1]);			
		transitionV.Add(statePost[2]);
		transitionV.Add(statePost[3]);
		transitionV.Add(statePost[4]);
		return transitionV;
	}

	EKFKidney2C(int DP, int MP, int CP) : ExtendedKalmanFilter(DP, MP, CP) {
		// we only need one additional paramter here
		parameterV.Gen(1, 1);
	}
};

#define _DP 1
#define _MP 1
#define _CP 0


int main_ledvice(int argc, char* argv[]){
	TFltV controlV;
	TFltV predictedV;
	TFltV measurementV;
	TFltV correctedV;
	
	TStr InFNm, OutFNm;
	TStr LnStr, OutLnStr;
	TStr ValStr, TimeStr;

	// define KF & init matrixes
	EKFKidney2C KF = EKFKidney2C(_DP, _MP, _CP);
	TLAMisc::FillIdentity(KF.transitionMatrix);		// DPxDP	

	TLAMisc::FillIdentity(KF.processNoiseCov, 0.0000000000001); // DPxDP
	TLAMisc::FillIdentity(KF.measurementNoiseCov, 0.2); // MPxMP
	TLAMisc::FillIdentity(KF.errorCovPost, 0.5); // DPxDP

	// KF.processNoiseCov.At(1, 1) = 0.00000001;
	// KF.processNoiseCov.At(3, 3) = 0.00000001;

	// init measurement vector
	measurementV.Add(1.1, _MP);

	// set initial state to first measurement	
	InFNm = "podatki_ledvice.txt";
	TFIn LogFIn(InFNm);

	TInt TimestampN = 0;
	TInt ValueN = 2;
	const char Delimiter = ',';

	TStrV TokenV;

	// init state
	KF.statePost[0] = 5075.0;
	KF.statePost[1] = -0.008705;
	KF.statePost[2] = 6746.0;	
	KF.statePost[3] = -0.001442;
	KF.statePost[4] = 1918.0;

	printf("A = %f, l1 = %f, B = %f, l2 = %f, C = %f\n", (double)KF.statePost[0], KF.statePost[1], KF.statePost[2], KF.statePost[3], KF.statePost[4]);


	// get timestamp
	TFlt DeltaT;
	
	int lines = 0;

	vector<double> gnuX;

	vector<double> gnuY1;
	vector<double> gnuY2;
	vector<double> gnuY3;
	vector<double> gnuY4;
	vector<double> gnuY5;

	vector<double> gnuZ1;
	vector<double> gnuZ2;
	vector<double> gnuZ3;
  
	Gnuplot g2 = Gnuplot("lines");
    // g2.cmd("set logscale xy");

	int stevec = 0;
	double x;

	double chi2 = 0;
	double chi2c = 0;

	while (LogFIn.GetNextLn(LnStr) && (stevec < 100)) {
		DeltaT = 80.0;
		x = stevec * DeltaT;	
		stevec++;

		KF.parameterV[0] = x;

		KF.measurementMatrix(0, 0) = exp(KF.statePost[1] * x);
		KF.measurementMatrix(0, 1) = KF.statePost[0] * x * exp(KF.statePost[1] * x);
		KF.measurementMatrix(0, 2) = exp(KF.statePost[3] * x);
		KF.measurementMatrix(0, 3) = KF.statePost[2] * x * exp(KF.statePost[3] * x);
		KF.measurementMatrix(0, 4) = 1;

		// transitionMatrix is static - identity - initialized up there
		
		// read measurement from a file
		measurementV[0] = LnStr.GetFlt();

		predictedV = KF.Predict(controlV);
		correctedV = KF.Correct(measurementV);
		
		// printf("DT: %.2f\tM:%.2f \tP: %.2f\tC: %.2f\tC: %.2f\n", DeltaT, measurementV[0], predictedV[0], correctedV[0], KF.errorCovPost(0, 0));
		printf("A = %f, l1 = %f, B = %f, l2 = %f, C = %f\n", (double)KF.statePost[0], KF.statePost[1], KF.statePost[2], KF.statePost[3], KF.statePost[4]);

		gnuX.push_back(x);
		
		double dy = measurementV[0] - KF.predictionEq()[0];
		double dyc = measurementV[0] - KF.observationEq()[0];
		chi2 += dy*dy / measurementV[0];
		chi2c += dyc*dyc / measurementV[0];

		printf("chi2 = %f\n", chi2);

		gnuZ1.push_back(measurementV[0]);	
		gnuZ2.push_back(KF.observationEq()[0]);
		gnuZ3.push_back(KF.predictionEq()[0]);

		gnuY1.push_back(predictedV[0]);
		gnuY2.push_back(predictedV[2]);
		gnuY3.push_back(predictedV[1]);
		gnuY4.push_back(predictedV[3]);
		
	}
	
	printf("chi2 = %f; chi2c = %f\n\n", chi2, chi2c);

	g2.plot_xy(gnuX, gnuZ1, "meritev");
	g2.plot_xy(gnuX, gnuZ3, "predikcija");
	g2.plot_xy(gnuX, gnuZ2, "korekcija");
 
	getch();

	g2.cmd("set output 'test.eps'");
	g2.cmd("set terminal postscript enhanced color");
	g2.cmd("replot");

	getch();

	return 0;		
}

int main_sin(int argc, char* argv[]){
	// initialize normal distribution 
	std::default_random_engine generator;
	std::normal_distribution<double> distribution(0.0, 0.5);

	TFltV controlV;
	TFltV predictedV;
	TFltV measurementV;
	TFltV correctedV;
	
	TStr InFNm, OutFNm;
	TStr LnStr, OutLnStr;
	TStr ValStr, TimeStr;

	// define KF & init matrixes
	EKFSine KF = EKFSine(_DP, _MP, _CP);
	TLAMisc::FillIdentity(KF.transitionMatrix);		// DPxDP	
	// TLAMisc::FillIdentity(KF.measurementMatrix);
	KF.measurementMatrix(0, 0) = 1;
	KF.measurementMatrix(0, 1) = 0;

	TLAMisc::FillIdentity(KF.processNoiseCov, 0.000001); // DPxDP
	TLAMisc::FillIdentity(KF.measurementNoiseCov, 0.1); // MPxMP
	TLAMisc::FillIdentity(KF.errorCovPost, 0.00000000001); // DPxDP

	// popravek zaradi faznega zamika
	// KF.processNoiseCov.At(1, 1) = 0.1;

	// init measurement vector
	measurementV.Add(1.1, _MP);

	// set initial state to first measurement	
	// InFNm = "C:\\Users\\Klemen\\Documents\\Work\\Diploma\\Implementacija\\Data\\ntua_hydr.csv";
	// OutFNm = "C:\\Users\\Klemen\\Documents\\Work\\Diploma\\Implementacija\\Data\\ntua_hydr_power_3d.csv";

	// TFIn LogFIn(InFNm);
	// TFOut LogFOut(OutFNm);

	TInt TimestampN = 0;
	TInt ValueN = 2;
	const char Delimiter = ',';

	TStrV TokenV;

	// read first N lines
	TInt N = 3;
	// for (int i = 0; i < N; i++)	LogFIn.GetNextLn(LnStr);

	// tokenize string
	// LnStr.ChangeStrAll("\"", "");
	// LnStr.SplitOnAllCh(Delimiter, TokenV);

	// 1-dim model
	// KF.statePost[0] = TokenV[ValueN].GetFlt();	
	KF.statePost[0] = 1;
	// 2-dim model
	KF.statePost[1] = 3.500;
	// 3-d model
	// KF.statePost[2] = 0;	

	// get timestamp
	// TTm LastTm = ParseNTUATmStr(TokenV[TimestampN]);
	// TTm NewTm;
	TFlt DeltaT;
	
	int lines = 0;

	vector<double> gnuXX;
	vector<double> gnuX;
	vector<double> gnuY;
	vector<double> gnuZ;
	vector<double> gnuW;
  
	Gnuplot g2 = Gnuplot("lines");
    
	//g2.cmd("set title ''");  
	//g2.cmd("set pm3d"); 
	// g2.cmd("set palette defined ( 0 0 0 1, 1 1 1 1 )");
	// g2.cmd("set zrange [0:0.021]");
	// g2.cmd("set map");
	// g2.cmd("unset key");
	// g2.cmd("set cntrparam levels 10");
	// g2.cmd("set contour base");
	// g2.cmd("unset surface");
	// g2.cmd("set view 0,0,1.5");
	// g2.cmd("set hidden3d");
	// g2.cmd("set size square");
	// g2
	int stevec = 0;
	double x;

	// while (LogFIn.GetNextLn(LnStr) && (lines < 154)) {
	while (stevec < 6.5*628) {
		stevec++;
		DeltaT = 0.02;
		x = stevec * DeltaT;	
		KF.parameterV[0] = x;

		KF.measurementMatrix(0, 0) = sin(KF.statePost[1] * x);
		KF.measurementMatrix(0, 1) = KF.statePost[0] * x * cos(KF.statePost[1] * x);

		/*
		lines++;

		// tokenize string
		LnStr.ChangeStrAll("\"", "");
		LnStr.SplitOnAllCh(Delimiter, TokenV);
		// extract time
		NewTm = ParseNTUATmStr(TokenV[TimestampN]);
		// get delta t
		DeltaT = TTm::GetDiffMins(NewTm, LastTm);
		LastTm = NewTm;
		*/

		// create transitional matrix (A)
		// 1-d
		KF.transitionMatrix(0, 0) = 1;

		// 2-d nelinear A Sin [lambda x]
		KF.transitionMatrix(0, 1) = 0;
		KF.transitionMatrix(1, 0) = 0;
		KF.transitionMatrix(1, 1) = 1;

		/*
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
		*/

		// 1-d model
		// measurementV[0] = TokenV[ValueN].GetFlt();
		measurementV[0] = 2 * sin(3 * x) + distribution(generator);

		predictedV = KF.Predict(controlV);
		correctedV = KF.Correct(measurementV);
		
		// printf("DT: %.2f\tM:%.2f \tP: %.2f\tC: %.2f\tC: %.2f\n", DeltaT, measurementV[0], predictedV[0], correctedV[0], KF.errorCovPost(0, 0));
		
		if (stevec > 6 * 628) {
			gnuX.push_back(x);
			// gnuY.push_back(measurementV[0]);
			gnuXX.push_back(measurementV[0]);
			gnuY.push_back(correctedV[0] * sin(correctedV[1] * x));
			gnuZ.push_back(predictedV[0]);
			gnuW.push_back(predictedV[1]);
		}
		// OutLnStr = TokenV[TimestampN] + ";" + measurementV[0].GetStr() + ";" + predictedV[0].GetStr() + ";" + correctedV[0].GetStr() + ";" + KF.errorCovPost(0, 0).GetStr();
		// LogFOut.PutStrLn(OutLnStr);
	}
	
	g2.plot_xy(gnuX, gnuXX, "meritve");
	g2.plot_xy(gnuX, gnuY, "funkcija");
	g2.plot_xy(gnuX, gnuZ, "A");
	g2.plot_xy(gnuX, gnuW, "lambda");
 
	getch();

	g2.cmd("set output 'test.eps'");
	g2.cmd("set terminal postscript enhanced color");
	g2.cmd("replot");

	getch();

	return 0;		
}

int main_2nd(int argc, char* argv[]){  // standard KF
	// initialize normal distribution 
	std::default_random_engine generator;
	std::normal_distribution<double> distribution(0.0, 0.5);
	
	TFltV controlV;
	TFltV predictedV;
	TFltV measurementV;
	TFltV correctedV;
	
	TStr InFNm, OutFNm;
	TStr LnStr, OutLnStr;
	TStr ValStr, TimeStr;

	// define KF & init matrixes
	KalmanFilter KF = KalmanFilter(_DP, _MP, _CP);
	TLAMisc::FillIdentity(KF.transitionMatrix);		// DPxDP	
	// TLAMisc::FillIdentity(KF.measurementMatrix);
	KF.measurementMatrix(0, 0) = 1;
	KF.measurementMatrix(0, 1) = 0;

	TLAMisc::FillIdentity(KF.processNoiseCov, 0.000001); // DPxDP
	TLAMisc::FillIdentity(KF.measurementNoiseCov, 0.2); // MPxMP
	TLAMisc::FillIdentity(KF.errorCovPost, 0.00001); // DPxDP

	// popravek zaradi faznega zamika
	// KF.processNoiseCov.At(1, 1) = 0.1;

	// init measurement vector
	measurementV.Add(1.1, _MP);

	// set initial state to first measurement	
	// InFNm = "C:\\Users\\Klemen\\Documents\\Work\\Diploma\\Implementacija\\Data\\ntua_hydr.csv";
	// OutFNm = "C:\\Users\\Klemen\\Documents\\Work\\Diploma\\Implementacija\\Data\\ntua_hydr_power_3d.csv";
	InFNm = "Data - temp.csv";

	TFIn LogFIn(InFNm);
	// TFOut LogFOut(OutFNm);

	TInt TimestampN = 1;
	TInt ValueN = 2;
	const char Delimiter = ';';

	TStrV TokenV;

	// read first N lines
	TInt N = 2;
	for (int i = 0; i < N; i++)	LogFIn.GetNextLn(LnStr);

	// tokenize string
	LnStr.ChangeStrAll("\"", "");
	LnStr.ChangeStrAll(",", ".");
	LnStr.SplitOnAllCh(Delimiter, TokenV);

	// 1-dim model
	// KF.statePost[0] = TokenV[ValueN].GetFlt();	
	KF.statePost[0] = TokenV[ValueN].GetFlt();
	// 2-dim model
	KF.statePost[1] = 0.000;
	// 3-d model
	// KF.statePost[2] = 0;	

	// get timestamp
	// TTm LastTm = ParseNTUATmStr(TokenV[TimestampN]);
	// TTm NewTm;
	TFlt DeltaT;
	
	int lines = 0;

	vector<double> gnuX;
	vector<double> gnuY;
	vector<double> gnuZ;
	vector<double> gnuW;
	vector<double> gnuSMax;
	vector<double> gnuSMin;
  
	Gnuplot g2 = Gnuplot("lines");
    
	//g2.cmd("set title ''");  
	//g2.cmd("set pm3d"); 
	// g2.cmd("set palette defined ( 0 0 0 1, 1 1 1 1 )");
	// g2.cmd("set zrange [0:0.021]");
	// g2.cmd("set map");
	// g2.cmd("unset key");
	// g2.cmd("set cntrparam levels 10");
	// g2.cmd("set contour base");
	// g2.cmd("unset surface");
	// g2.cmd("set view 0,0,1.5");
	// g2.cmd("set hidden3d");
	// g2.cmd("set size square");
	// g2
	int stevec = 0;
	double x;
	double PMin;
	double PMax;

	while (LogFIn.GetNextLn(LnStr)) {
	// while (stevec < 15*600) {
		stevec++;
		DeltaT = 15;
		x = stevec * DeltaT;	

		/*
		KF.measurementMatrix(0, 0) = sin(KF.statePost[1] * x);
		KF.measurementMatrix(0, 1) = KF.statePost[0] * x * cos(KF.statePost[1] * x);
		*/

		
		
		// tokenize string
		LnStr.ChangeStrAll("\"", "");
		LnStr.ChangeStrAll(",", ".");
		LnStr.SplitOnAllCh(Delimiter, TokenV);
		/*
		// extract time
		// NewTm = ParseNTUATmStr(TokenV[TimestampN]);
		// get delta t
		DeltaT = TTm::GetDiffMins(NewTm, LastTm);
		LastTm = NewTm;
		*/

		// create transitional matrix (A)
		// 1-d
		KF.transitionMatrix(0, 0) = 1;

		
		/*
		// 2-d nelinear A Sin [lambda x]
		KF.transitionMatrix(0, 1) = 0;
		KF.transitionMatrix(1, 0) = 0;
		KF.transitionMatrix(1, 1) = 1;
		*/
		
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
		double raw_measurement = measurementV[0];		

		// measurementV[0] = 2 * sin(3 * x) + distribution(generator);

		predictedV = KF.Predict(controlV);

		PMin = predictedV[0] - 5.0 * KF.errorCovPre.At(0, 0);
		PMax = predictedV[0] + 5.0 * KF.errorCovPre.At(0, 0);

		bool outlier = false;

		if ((stevec > 260) && (stevec < 450)) {
			if (((measurementV[0] > PMax) || (measurementV[0] < PMin))) {			
				printf("Outlier: %.2f, %.2f, min: %.2f, max: %.2f\n", x, measurementV[0], predictedV[0], PMin, PMax);
				measurementV[0] = predictedV[0];
				// KF.errorCovPre(0, 0) = 10000;
				// KF.errorCovPost(0, 0) = 10000;
				// printf("ECin - %.2f\n", KF.errorCovPre(0, 0));
				outlier = true;
			}
		}
		// printf("ECout - %.2f\n", KF.errorCovPre(0, 0));
		correctedV = KF.Correct(measurementV);

		if (outlier) KF.errorCovPost(0, 0) = KF.errorCovPost(0, 0) * 15.0;
		// printf("ECafter - %.2f\n", KF.errorCovPre(0, 0));
		// getch();

		// printf("DT: %.2f\tM:%.2f \tP: %.2f\tC: %.2f\tC: %.2f\n", DeltaT, measurementV[0], predictedV[0], correctedV[0], KF.errorCovPost(0, 0));
		
		if ((stevec > 250) && (stevec < 500)) {
			gnuX.push_back(x);
			// gnuY.push_back(measurementV[0]);
			gnuY.push_back(raw_measurement);
			gnuZ.push_back(predictedV[0]);
			gnuW.push_back(correctedV[0]);
			gnuSMin.push_back(PMin);
			gnuSMax.push_back(PMax);

		}
		// OutLnStr = TokenV[TimestampN] + ";" + measurementV[0].GetStr() + ";" + predictedV[0].GetStr() + ";" + correctedV[0].GetStr() + ";" + KF.errorCovPost(0, 0).GetStr();
		// LogFOut.PutStrLn(OutLnStr);
	}
	
	g2.plot_xy(gnuX, gnuY, "measurement");
	//g2.plot_xy(gnuX, gnuZ, "prediction");
	// g2.plot_xy(gnuX, gnuW, "correction");
	g2.plot_xy(gnuX, gnuSMin, "lower border");
	g2.plot_xy(gnuX, gnuSMax, "upper border");
 
	getch();

	g2.cmd("set output 'test.emf'");
	g2.cmd("set terminal emf solid 'Arial' 16");
	g2.cmd("set terminal emf color solid");
	g2.cmd("set terminal emf linewidth 2");
	g2.cmd("replot");

	getch();

	return 0;		
}

int main_last(int argc, char* argv[]){  // last measurement	
	
	TStr InFNm, OutFNm;
	TStr LnStr, OutLnStr;
	TStr ValStr, TimeStr;
	// TTm NewTm;
	TFlt DeltaT;

	double gap = 3.0;

#ifdef _ARTIFICIAL
	InFNm = "artificial_15min_0.05_0.1_1_5_noise0.02.csv";
	DeltaT = 15;
#else
	InFNm = "ds_real_aug.csv";
	DeltaT = 1;
#endif

	TFIn LogFIn(InFNm);
	// TFOut LogFOut(OutFNm);

	TInt TimestampN = 1;
	TInt ValueN = 2;
	TInt ClassifierN = 3;
	const char Delimiter = ';';

	TStrV TokenV;

	// read first N lines
	TInt N = 2;
	for (int i = 0; i < N; i++)	LogFIn.GetNextLn(LnStr);

	// tokenize string
	LnStr.ChangeStrAll("\"", "");
	LnStr.ChangeStrAll(",", ".");
	LnStr.SplitOnAllCh(Delimiter, TokenV);
	
	// initialize
	double measurement;
	measurement = TokenV[ValueN].GetFlt();
	
	int lines = 0;

	vector<double> gnuX;
	vector<double> gnuY;
	vector<double> gnuZ;
	vector<double> gnuW;
	vector<double> gnuSMax;
	vector<double> gnuSMin;
  
	Gnuplot g2 = Gnuplot("lines");
    	
	int stevec = 0;
	double x;
	double PMin;
	double PMax;
	double predicted;

	int tn = 0, tp = 0, fn = 0, fp = 0;

	while (LogFIn.GetNextLn(LnStr) && stevec < 10000) {
	// while (stevec < 15*600) {
		stevec++;
		
		x = stevec * DeltaT;			
		
		// tokenize string
		LnStr.ChangeStrAll("\"", "");
		LnStr.ChangeStrAll(",", ".");
		LnStr.SplitOnAllCh(Delimiter, TokenV);
		
		// prediction methods
		// LAST MEASUREMENT
		predicted = measurement;
		measurement = TokenV[ValueN].GetFlt();

		PMin = predicted - gap;
		PMax = predicted + gap;

		bool outlier = false;


		if (((measurement > PMax) || (measurement < PMin))) {			
			// printf("Outlier: %.2f, %.2f, min: %.2f, max: %.2f\n", x, measurement, predicted, PMin, PMax);			
			// KF.errorCovPre(0, 0) = 10000;
			// KF.errorCovPost(0, 0) = 10000;
			// printf("ECin - %.2f\n", KF.errorCovPre(0, 0));
			outlier = true;
#ifdef _ARTIFICIAL
			if (TokenV[ClassifierN] != " ") tp++;
#else
			if (TokenV.Len() == ClassifierN + 1) tp++;
#endif
			else fp++;
		} else {
			outlier = false;
#ifdef _ARTIFICIAL
			if (TokenV[ClassifierN] != " ") fn++;
#else
			if (TokenV.Len() == ClassifierN + 1) fn++;
#endif
			else tn++;
		}
		
		if (stevec < 500) {
			gnuX.push_back(x);
			// gnuY.push_back(measurementV[0]);
			gnuY.push_back(measurement);
			gnuSMin.push_back(PMin);
			gnuSMax.push_back(PMax);

		}

	}
	
	double precision;
	double recall;
	double f1;
	
	if ((tp + fp) != 0)	precision = (double)tp / (tp + fp); else precision = -999;
	if ((tp + fn) != 0) recall = (double)tp / (tp + fn); else recall = -999;
	f1 = 2 * (precision * recall) / (precision + recall);

	printf("F1 = %f, precision = %f, recall = %f, tp = %d, tn = %d, fp = %d, fn = %d\n", f1, precision, recall, tp, tn, fp, fn);

	g2.plot_xy(gnuX, gnuY, "measurement");
	//g2.plot_xy(gnuX, gnuZ, "prediction");
	// g2.plot_xy(gnuX, gnuW, "correction");
	g2.plot_xy(gnuX, gnuSMin, "lower border");
	g2.plot_xy(gnuX, gnuSMax, "upper border");
 
	getch();

	g2.cmd("set output 'test.emf'");
	g2.cmd("set terminal emf solid 'Arial' 16");
	g2.cmd("set terminal emf color solid");
	g2.cmd("set terminal emf linewidth 2");
	g2.cmd("replot");

	getch();

	return 0;		
}

#define _ARTIFICIAL

double GetAverage(TFltV vec, int n) {
	double sum = 0;
	for (int i = 0; i < n; i++)
		sum += vec[i];
	return sum / n;
}

int main_ma(int argc, char* argv[]){  // moving average
	
	TStr InFNm, OutFNm;
	TStr LnStr, OutLnStr;
	TStr ValStr, TimeStr;
	// TTm NewTm;
	TFlt DeltaT;

	TFltV measurementV;
	TInt mIndex = 0;
	TInt mWidth = 5;

	double gap = 0.9;

#ifdef _ARTIFICIAL
	InFNm = "artificial_15min_0.05_0.1_1_5_noise0.02.csv";
	DeltaT = 15;
#else
	InFNm = "ds_real_aug.csv";
	DeltaT = 1;
#endif

	TFIn LogFIn(InFNm);
	// TFOut LogFOut(OutFNm);

	TInt TimestampN = 1;
	TInt ValueN = 2;
	TInt ClassifierN = 3;
	const char Delimiter = ';';

	TStrV TokenV;

	// read first N lines
	TInt N = 2;
	for (int i = 0; i < N; i++)	LogFIn.GetNextLn(LnStr);

	// tokenize string
	LnStr.ChangeStrAll("\"", "");
	LnStr.ChangeStrAll(",", ".");
	LnStr.SplitOnAllCh(Delimiter, TokenV);
	
	// initialize
	double measurement;
	measurement = TokenV[ValueN].GetFlt();
	measurementV.Gen(5);
	for (int i = 0; i < measurementV.Len(); i++)
		measurementV[i] = measurement;
	mIndex++;
	
	int lines = 0;

	vector<double> gnuX;
	vector<double> gnuY;
	vector<double> gnuZ;
	vector<double> gnuW;
	vector<double> gnuSMax;
	vector<double> gnuSMin;
  
	Gnuplot g2 = Gnuplot("lines");
    	
	int stevec = 0;
	double x;
	double PMin;
	double PMax;
	double predicted;

	int tn = 0, tp = 0, fn = 0, fp = 0;

	while (LogFIn.GetNextLn(LnStr) && stevec < 10000) {
	// while (stevec < 15*600) {
		stevec++;
		
		x = stevec * DeltaT;			
		
		// tokenize string
		LnStr.ChangeStrAll("\"", "");
		LnStr.ChangeStrAll(",", ".");
		LnStr.SplitOnAllCh(Delimiter, TokenV);
		
		// prediction methods
		// LAST MEASUREMENT
		predicted = GetAverage(measurementV, mWidth);
		measurement = TokenV[ValueN].GetFlt();

		PMin = predicted - gap;
		PMax = predicted + gap;

		bool outlier = false;


		if (((measurement > PMax) || (measurement < PMin))) {			
			// printf("Outlier: %.2f, %.2f, min: %.2f, max: %.2f\n", x, measurement, predicted, PMin, PMax);			
			// KF.errorCovPre(0, 0) = 10000;
			// KF.errorCovPost(0, 0) = 10000;
			// printf("ECin - %.2f\n", KF.errorCovPre(0, 0));
			outlier = true;
			measurement = predicted;
#ifdef _ARTIFICIAL
			if (TokenV[ClassifierN] != " ") tp++;
#else
			if (TokenV.Len() == ClassifierN + 1) tp++;
#endif
			else fp++;
		} else {
			outlier = false;
#ifdef _ARTIFICIAL
			if (TokenV[ClassifierN] != " ") fn++;
#else
			if (TokenV.Len() == ClassifierN + 1) fn++;
#endif
			else tn++;
		}
		
		measurementV[mIndex] = measurement;
		mIndex++;
		if (mIndex == mWidth) mIndex = 0;


		if (stevec < 500) {
			gnuX.push_back(x);
			// gnuY.push_back(measurementV[0]);
			gnuY.push_back(measurement);
			gnuSMin.push_back(PMin);
			gnuSMax.push_back(PMax);

		}

	}
	
	double precision;
	double recall;
	double f1;
	
	if ((tp + fp) != 0)	precision = (double)tp / (tp + fp); else precision = -999;
	if ((tp + fn) != 0) recall = (double)tp / (tp + fn); else recall = -999;
	f1 = 2 * (precision * recall) / (precision + recall);

	printf("F1 = %f, precision = %f, recall = %f, tp = %d, tn = %d, fp = %d, fn = %d\n", f1, precision, recall, tp, tn, fp, fn);

	g2.plot_xy(gnuX, gnuY, "measurement");
	//g2.plot_xy(gnuX, gnuZ, "prediction");
	// g2.plot_xy(gnuX, gnuW, "correction");
	g2.plot_xy(gnuX, gnuSMin, "lower border");
	g2.plot_xy(gnuX, gnuSMax, "upper border");
 
	getch();

	g2.cmd("set output 'test.emf'");
	g2.cmd("set terminal emf solid 'Arial' 16");
	g2.cmd("set terminal emf color solid");
	g2.cmd("set terminal emf linewidth 2");
	g2.cmd("replot");

	getch();

	return 0;		
}

int main_mat(int argc, char* argv[]){  // moving average with trend
	
	TStr InFNm, OutFNm;
	TStr LnStr, OutLnStr;
	TStr ValStr, TimeStr;
	// TTm NewTm;
	TFlt DeltaT;

	TFltV measurementV;
	TInt mIndex = 0;
	TInt mWidth = 5;
	TFltV trendV;
	TInt tIndex;
	TFlt trend;

	double gap = 0.089;

#ifdef _ARTIFICIAL
	InFNm = "artificial_15min_0.05_0.1_1_5_noise0.02.csv";
	DeltaT = 15;
#else
	InFNm = "ds_real_aug.csv";
	DeltaT = 1;
#endif

	TFIn LogFIn(InFNm);
	// TFOut LogFOut(OutFNm);

	TInt TimestampN = 1;
	TInt ValueN = 2;
	TInt ClassifierN = 3;
	const char Delimiter = ';';

	TStrV TokenV;

	// read first N lines
	TInt N = 2;
	for (int i = 0; i < N; i++)	LogFIn.GetNextLn(LnStr);

	// tokenize string
	LnStr.ChangeStrAll("\"", "");
	LnStr.ChangeStrAll(",", ".");
	LnStr.SplitOnAllCh(Delimiter, TokenV);
	
	// initialize
	double measurement;
	measurement = TokenV[ValueN].GetFlt();
	measurementV.Gen(5);
	trendV.Gen(5);
	for (int i = 0; i < measurementV.Len(); i++) {
		measurementV[i] = measurement;
		trendV[i] = measurement;
	}
	mIndex++;
	tIndex++;
	
	int lines = 0;

	vector<double> gnuX;
	vector<double> gnuY;
	vector<double> gnuZ;
	vector<double> gnuW;
	vector<double> gnuSMax;
	vector<double> gnuSMin;
  
	Gnuplot g2 = Gnuplot("lines");
    	
	int stevec = 0;
	double x;
	double PMin;
	double PMax;
	double predicted;

	int tn = 0, tp = 0, fn = 0, fp = 0;

	while (LogFIn.GetNextLn(LnStr) && stevec < 10000) {
	// while (stevec < 15*600) {
		stevec++;
		
		x = stevec * DeltaT;			
		
		// tokenize string
		LnStr.ChangeStrAll("\"", "");
		LnStr.ChangeStrAll(",", ".");
		LnStr.SplitOnAllCh(Delimiter, TokenV);
		
		// prediction methods
		// LAST MEASUREMENT
		predicted = GetAverage(measurementV, mWidth) + (GetAverage(measurementV, mWidth) - GetAverage(trendV, mWidth)) / mWidth;
		measurement = TokenV[ValueN].GetFlt();

		PMin = predicted - gap;
		PMax = predicted + gap;

		bool outlier = false;


		if (((measurement > PMax) || (measurement < PMin))) {			
			// printf("Outlier: %.2f, %.2f, min: %.2f, max: %.2f\n", x, measurement, predicted, PMin, PMax);			
			// KF.errorCovPre(0, 0) = 10000;
			// KF.errorCovPost(0, 0) = 10000;
			// printf("ECin - %.2f\n", KF.errorCovPre(0, 0));
			outlier = true;
			measurement = predicted;
#ifdef _ARTIFICIAL
			if (TokenV[ClassifierN] != " ") tp++;
#else
			if (TokenV.Len() == ClassifierN + 1) tp++;
#endif
			else fp++;
		} else {
			outlier = false;
#ifdef _ARTIFICIAL
			if (TokenV[ClassifierN] != " ") fn++;
#else
			if (TokenV.Len() == ClassifierN + 1) fn++;
#endif
			else tn++;
		}
		
		trendV[tIndex] = measurementV[mIndex];
		tIndex++;
		measurementV[mIndex] = measurement;
		mIndex++;
		if (mIndex == mWidth) mIndex = 0;
		if (tIndex == mWidth) tIndex = 0;


		if (stevec < 500) {
			gnuX.push_back(x);
			// gnuY.push_back(measurementV[0]);
			gnuY.push_back(measurement);
			gnuSMin.push_back(PMin);
			gnuSMax.push_back(PMax);

		}

	}
	
	double precision;
	double recall;
	double f1;
	
	if ((tp + fp) != 0)	precision = (double)tp / (tp + fp); else precision = -999;
	if ((tp + fn) != 0) recall = (double)tp / (tp + fn); else recall = -999;
	f1 = 2 * (precision * recall) / (precision + recall);

	printf("F1 = %f, precision = %f, recall = %f, tp = %d, tn = %d, fp = %d, fn = %d\n", f1, precision, recall, tp, tn, fp, fn);

	g2.plot_xy(gnuX, gnuY, "measurement");
	//g2.plot_xy(gnuX, gnuZ, "prediction");
	// g2.plot_xy(gnuX, gnuW, "correction");
	g2.plot_xy(gnuX, gnuSMin, "lower border");
	g2.plot_xy(gnuX, gnuSMax, "upper border");
 
	getch();

	g2.cmd("set output 'test.emf'");
	g2.cmd("set terminal emf solid 'Arial' 16");
	g2.cmd("set terminal emf color solid");
	g2.cmd("set terminal emf linewidth 2");
	g2.cmd("replot");

	getch();

	return 0;		
}

int main(int argc, char* argv[]){  // standard KF
	// initialize normal distribution 
	std::default_random_engine generator;
	std::normal_distribution<double> distribution(0.0, 0.5);
	
	TFltV controlV;
	TFltV predictedV;
	TFltV measurementV;
	TFltV correctedV;
	
	TStr InFNm, OutFNm;
	TStr LnStr, OutLnStr;
	TStr ValStr, TimeStr;

	// define KF & init matrixes
	KalmanFilter KF = KalmanFilter(_DP, _MP, _CP);
	TLAMisc::FillIdentity(KF.transitionMatrix);		// DPxDP	
	// TLAMisc::FillIdentity(KF.measurementMatrix);
	KF.measurementMatrix(0, 0) = 1;
	KF.measurementMatrix(0, 1) = 0;

	TLAMisc::FillIdentity(KF.processNoiseCov, 0.00000001); // DPxDP
	TLAMisc::FillIdentity(KF.measurementNoiseCov, 0.5); // MPxMP
	TLAMisc::FillIdentity(KF.errorCovPost, 0.00001); // DPxDP

	// popravek zaradi faznega zamika
	// KF.processNoiseCov.At(1, 1) = 0.1;

	// init measurement vector
	measurementV.Add(1.1, _MP);

	TFlt DeltaT;
	// set initial state to first measurement	
	// InFNm = "C:\\Users\\Klemen\\Documents\\Work\\Diploma\\Implementacija\\Data\\ntua_hydr.csv";
	// OutFNm = "C:\\Users\\Klemen\\Documents\\Work\\Diploma\\Implementacija\\Data\\ntua_hydr_power_3d.csv";
	double gap = 3.1;

#ifdef _ARTIFICIAL
	InFNm = "artificial_15min_0.05_0.1_1_5_noise0.02.csv";
	DeltaT = 15;
#else
	InFNm = "ds_real_aug.csv";
	DeltaT = 1;
#endif

	TFIn LogFIn(InFNm);
	// TFOut LogFOut(OutFNm);

	TInt TimestampN = 1;
	TInt ValueN = 2;
	TInt ClassifierN = 3;
	const char Delimiter = ';';

	TStrV TokenV;

	// read first N lines
	TInt N = 2;
	for (int i = 0; i < N; i++)	LogFIn.GetNextLn(LnStr);

	// tokenize string
	LnStr.ChangeStrAll("\"", "");
	LnStr.ChangeStrAll(",", ".");
	LnStr.SplitOnAllCh(Delimiter, TokenV);

	// 1-dim model
	// KF.statePost[0] = TokenV[ValueN].GetFlt();	
	KF.statePost[0] = TokenV[ValueN].GetFlt();
	// 2-dim model
	// KF.statePost[1] = 0.000;
	// 3-d model
	// KF.statePost[2] = 0;	

	// get timestamp
	// TTm LastTm = ParseNTUATmStr(TokenV[TimestampN]);
	// TTm NewTm;
	
	
	int lines = 0;

	vector<double> gnuX;
	vector<double> gnuY;
	vector<double> gnuZ;
	vector<double> gnuW;
	vector<double> gnuSMax;
	vector<double> gnuSMin;
  
	Gnuplot g2 = Gnuplot("lines");
    
	//g2.cmd("set title ''");  
	//g2.cmd("set pm3d"); 
	// g2.cmd("set palette defined ( 0 0 0 1, 1 1 1 1 )");
	// g2.cmd("set zrange [0:0.021]");
	// g2.cmd("set map");
	// g2.cmd("unset key");
	// g2.cmd("set cntrparam levels 10");
	// g2.cmd("set contour base");
	// g2.cmd("unset surface");
	// g2.cmd("set view 0,0,1.5");
	// g2.cmd("set hidden3d");
	// g2.cmd("set size square");
	// g2
	int stevec = 0;
	double x;
	double PMin;
	double PMax;

	int tn = 0, tp = 0, fn = 0, fp = 0;

	while (LogFIn.GetNextLn(LnStr) && stevec < 10000) {
	// while (stevec < 15*600) {
		stevec++;		
		x = stevec * DeltaT;	

		/*
		KF.measurementMatrix(0, 0) = sin(KF.statePost[1] * x);
		KF.measurementMatrix(0, 1) = KF.statePost[0] * x * cos(KF.statePost[1] * x);
		*/

		
		
		// tokenize string
		LnStr.ChangeStrAll("\"", "");
		LnStr.ChangeStrAll(",", ".");
		LnStr.SplitOnAllCh(Delimiter, TokenV);
		/*
		// extract time
		// NewTm = ParseNTUATmStr(TokenV[TimestampN]);
		// get delta t
		DeltaT = TTm::GetDiffMins(NewTm, LastTm);
		LastTm = NewTm;
		*/

		// create transitional matrix (A)
		// 1-d
		KF.transitionMatrix(0, 0) = 1;

		
		/*
		// 2-d nelinear A Sin [lambda x]
		KF.transitionMatrix(0, 1) = 0;
		KF.transitionMatrix(1, 0) = 0;
		KF.transitionMatrix(1, 1) = 1;
		*/
		
		// 2-d
		/*
		KF.transitionMatrix(0, 1) = DeltaT;		
		KF.transitionMatrix(1, 0) = 0;
		KF.transitionMatrix(1, 1) = 1;		
		*/
		// 3-d
		/*
		KF.transitionMatrix(0, 2) = 1./2 * DeltaT * DeltaT;
		KF.transitionMatrix(1, 2) = DeltaT;
		KF.transitionMatrix(2, 0) = 0;
		KF.transitionMatrix(2, 1) = 0;
		KF.transitionMatrix(2, 2) = 1;
		*/

		// 1-d model
		
		measurementV[0] = TokenV[ValueN].GetFlt();
		double raw_measurement = measurementV[0];		

		// measurementV[0] = 2 * sin(3 * x) + distribution(generator);

		predictedV = KF.Predict(controlV);

		PMin = predictedV[0] - gap * KF.errorCovPre.At(0, 0);
		PMax = predictedV[0] + gap * KF.errorCovPre.At(0, 0);

		bool outlier = false;

		if (((measurementV[0] > PMax) || (measurementV[0] < PMin))) {			
			// printf("Outlier: %.2f, %.2f, min: %.2f, max: %.2f\n", x, measurement, predicted, PMin, PMax);			
			// KF.errorCovPre(0, 0) = 10000;
			// KF.errorCovPost(0, 0) = 10000;
			// printf("ECin - %.2f\n", KF.errorCovPre(0, 0));
			outlier = true;
			measurementV[0] = predictedV[0];
#ifdef _ARTIFICIAL
			if (TokenV[ClassifierN] != " ") tp++;
#else
			if (TokenV.Len() == ClassifierN + 1) tp++;
#endif
			else fp++;
		} else {
			outlier = false;
#ifdef _ARTIFICIAL
			if (TokenV[ClassifierN] != " ") fn++;
#else
			if (TokenV.Len() == ClassifierN + 1) fn++;
#endif
			else tn++;
		}

		// printf("ECout - %.2f\n", KF.errorCovPre(0, 0));
		correctedV = KF.Correct(measurementV);

		if (outlier) KF.errorCovPost(0, 0) = KF.errorCovPost(0, 0) * 15.0;
		// printf("ECafter - %.2f\n", KF.errorCovPre(0, 0));
		// getch();

		// printf("DT: %.2f\tM:%.2f \tP: %.2f\tC: %.2f\tC: %.2f\n", DeltaT, measurementV[0], predictedV[0], correctedV[0], KF.errorCovPost(0, 0));
		
		if (stevec < 5000) {
			gnuX.push_back(x);
			// gnuY.push_back(measurementV[0]);
			gnuY.push_back(raw_measurement);
			// gnuZ.push_back(predictedV[0]);
			// gnuW.push_back(correctedV[0]);
			gnuSMin.push_back(PMin);
			gnuSMax.push_back(PMax);

		}
		// OutLnStr = TokenV[TimestampN] + ";" + measurementV[0].GetStr() + ";" + predictedV[0].GetStr() + ";" + correctedV[0].GetStr() + ";" + KF.errorCovPost(0, 0).GetStr();
		// LogFOut.PutStrLn(OutLnStr);
	}
	
	double precision;
	double recall;
	double f1;
	
	if ((tp + fp) != 0)	precision = (double)tp / (tp + fp); else precision = -999;
	if ((tp + fn) != 0) recall = (double)tp / (tp + fn); else recall = -999;
	f1 = 2 * (precision * recall) / (precision + recall);

	printf("F1 = %f, precision = %f, recall = %f, tp = %d, tn = %d, fp = %d, fn = %d\n", f1, precision, recall, tp, tn, fp, fn);


	g2.plot_xy(gnuX, gnuY, "measurement");
	//g2.plot_xy(gnuX, gnuZ, "prediction");
	// g2.plot_xy(gnuX, gnuW, "correction");
	g2.plot_xy(gnuX, gnuSMin, "lower border");
	g2.plot_xy(gnuX, gnuSMax, "upper border");
 
	getch();

	g2.cmd("set output 'test.emf'");
	g2.cmd("set terminal emf solid 'Arial' 16");
	g2.cmd("set terminal emf color solid");
	g2.cmd("set terminal emf linewidth 2");
	g2.cmd("replot");

	getch();

	return 0;		
}