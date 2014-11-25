///////////////////////////////
// Multi-level analysis clustering
class THierchCtmc: public TStreamAggr {
private:
	class TNode {
	public:
		const TUInt64 NodeId;
		const TInt Depth;

		THierchCtmc* Model;

		TFullMatrix CentroidMat;
		TIntV StateIdV;
		TVec<TUInt64FltPrV> QMatrixStats;

		// holds pairs <n,sum> where n is the number of points in state i
		// and sum is the sum of distances to the centroid
		TVec<TUInt64FltPr> StateStatV;

		TFullClust::TClust* Clust;

		TUInt64V RecIdV;

		TVec<TNode*> ChildV;

		TInt PrevStateIdx;
		TUInt64 PrevJumpTm;

	public:
		TNode();
		TNode(THierchCtmc* _Model, const PRecSet& RecSet, const int& NodeId, const int& Depth);

		~TNode() { delete Clust; }

		PJsonVal SaveJson() const;

		int GetStates() const { return CentroidMat.GetCols(); }
		int GetDim() const { return CentroidMat.GetRows(); }

		void OnAddRec(const TRec& Rec, const bool ShouldExpand=true);

	private:
		// updates the intensities
		void UpdateIntensities(const TRec& Rec);

		// statistics about states
		// updates the statistics about the record
		void UpdateStatistics(const TRec& Rec);
		void InitStateStats();

		double GetMeanPtCentroidDist(const int& StateIdx) const;
		uint64 GetStateSize(const int& StateIdx) const;

		// state utility functions
		bool ShouldExpand(const int& StateIdx) const;
		bool IsStateExpanded(const int& StateIdx) const;
		void ExpandState(const int& StateIdx);

		// computes and returns the matrix with transition intensities
		TFullMatrix GetQMatrix() const;

		void InitChildV();

		void InitClusts(const PRecSet& RecSet, TIntV& AssignIdxV);
		void InitIntensities(const PRecSet& RecSet, const TIntV& AssignIdxV);
	};

private:
	const static uint64 TU_SECOND;
	const static uint64 TU_MINUTE;
	const static uint64 TU_HOUR;
	const static uint64 TU_DAY;

	TWPt<TStore> InStore;
	TIntV FldIdV;
	TInt TimeFldId;

	PFtrSpace FtrSpace;

	TNode* RootNode;

	TUInt64 CurrRecs;
	TUInt64 MinRecs;

	TInt MaxDepth;

	PJsonVal ClustParams;
	TFlt ExpandThreshold;
	TUInt64 TimeUnit;

	TBool Normalize;

	TUInt64 CurrNodeId;

	TRnd Rnd;

protected:
	THierchCtmc(const TWPt<TBase>& Base, const TStr& AggrNm, const TStr& InStoreNm,
			const TStr& TimeFldNm, const TInt& _MinRecs, const PJsonVal& ClustParams,
			const TFlt& _ExpandThreshold, const TUInt64 _TimeUnit, const TInt& MaxDepth=TInt::Mx, const int& RndSeed=0);

public:
	THierchCtmc(const THierchCtmc& Model);
	~THierchCtmc();

	static PStreamAggr New(const TWPt<TBase>& Base, const TStr& AggrNm, const TStr& InStoreNm,
			const TStr& TimeFldNm, const TInt& _MinRecs, const PJsonVal& ClustParams,
			const TFlt& _ExpandThreshold, const TUInt64 _TimeUnit, const TInt& MaxDepth=TInt::Mx, const int& RndSeed=0);
	static PStreamAggr New(const TWPt<TQm::TBase>& Base, const PJsonVal& ParamVal);

	PJsonVal SaveJson(const int& Limit) const;
	PJsonVal SaveJson(const TNode* Node);

protected:
	void OnAddRec(const TRec& Rec);

	uint64 GenNodeId() { return CurrNodeId++; }

	// feature space
	TVector GetFtrV(const TRec& Rec) const;
	TFullMatrix GetFtrVV(const PRecSet& RecSet) const;
	TFullMatrix GetFtrVV(const TUInt64V& RecIdV) const;

	TVector InvertFtrV(const TVector& Vec) const;

	TStr GetFldNm(const int& FldIdx) const { return InStore->GetFieldNm(FldIdV[FldIdx]); }

	int GetMaxDepth() const;

	// clustering
	TFullClust::TClust* GetClust() const;

	// records
	PRecSet GetRecSet(const TUInt64V& RecIdV) const;

private:
	void InitRoot();

	// called by the destructor to cleanup the node structure
	static void DestroyNode(TNode* Node);

public:
	static TStr GetType() { return "process_state"; }
};
