#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;
int main()
{
    int n; cin>>n;
    vector<int64_t> v(n);
    for(int i=0; i<n; i++) 
    {
        cin>>v[i];
    }
    sort(v.begin(), v.end());

    int64_t sum=0;
    for(int i=0; i<n; i++)
    {
        sum+=(i+2)*v[i];
    }
    sum-=v[n-1];
    cout<<sum<<endl;
    return 0;
}
