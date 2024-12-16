# 인천시 버스 개선 프로젝트
프론트엔드: https://github.com/GoldenMine0502/bus_improvement_front

크롤러: https://github.com/GoldenMine0502/bus_improvement_crawler

백엔드: https://github.com/GoldenMine0502/bus_improvement_backend

기술스택: Kotlin, Retrofit, Selenium, Hibernate, MySQL, Spring, JavaScript, React

서비스: http://home.goldenmine.kr:3000/ (언제 닫힐진 모름)

# 프로젝트 개요
인천시 버스에 대한 이용량과 그에 맞는 최적화된 알고리즘을 시뮬레이션 합니다.

<img width="732" alt="image" src="https://github.com/user-attachments/assets/a8470cc8-37b7-4746-b514-2d9fa999ca9a">

이용량을 볼 수 있습니다.

<img width="732" alt="image" src="https://github.com/user-attachments/assets/7602bacb-3ed2-4e7e-8767-b56a35016fba">

각 노선 별 기존/알고리즘 적용시 경로에 대해 확인할 수 있습니다. All은 전체 경로, All이 안붙은 버튼은 왼쪽 아래에 경로를 입력해야 합니다.

# Original

기존 경로를 그대로 출력합니다.

# Shortest

<img width="732" alt="image" src="https://github.com/user-attachments/assets/4a1f6e2d-b0dd-41dc-a560-fa9fcc995335">

종점 기점이 고정일 때, 무조건 종점과 기점을 최단 경로로 잇습니다.

# Dijkstra

<img width="732" alt="image" src="https://github.com/user-attachments/assets/1b659bc2-4118-4d14-82f2-503c928703aa">

위 Shortest는 거리만을 경로의 주 cost로 삼으나, Dijsktra는 이용량과 노선 굴곡도를 함께 고려합니다.

![image](https://github.com/user-attachments/assets/0b2f0237-b869-48bf-b77d-b0b2aa6f622a)

노선 굴곡도는 위와 같으며, 노선 굴곡도가 큰 경로일수록 Dijkstra Cost가 커져 알고리즘이 기피하게 됩니다.

Dijkstra Cost = (거리) / (이용량) * (노선 굴곡도)

# Dijkstra Greedy

<img width="732" alt="image" src="https://github.com/user-attachments/assets/ddbda01b-43ff-4c62-93f3-692c8b5179a7">

위 Dijkstra 알고리즘의 cost의 문제점은 이용량이 많은 경로에 너무 많은 버스가 몰린다는 것입니다.

이를 해결하기 위해 이전의 버스가 지나간 노선은 이용량이 줄어들도록 설계했습니다.

Cost Function은 같습니다.

배차간격이 작은 노선이 우선 계산됩니다.

5와 25는 버스 한 번 이동에 몇명의 인원을 수송하는지 결정합니다. 5가 안정적으로 보입니다.

# 총평

Shorest Dijkstra Greedy를 비교해 보면, 좀 더 Dijsktra Greedy 알고리즘이 촘촘히 경로를 만들어가는 것을 볼 수 있습니다. 이예 따라 최대한 많은 인원이 버스를 이용할 수 있게 돕습니다.

<img width="732" alt="image" src="https://github.com/user-attachments/assets/0929dd3c-96fe-444d-b0f9-922b12921290">

Shortest

<img width="732" alt="image" src="https://github.com/user-attachments/assets/e5b9ab3f-9a12-4a61-bf38-6f08b6d4fd34">

Dijsktra Greedy (지나가는 정류장의 수가 많음)
